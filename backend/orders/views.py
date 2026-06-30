from rest_framework import viewsets, generics, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Order
from .serializers import OrderSerializer, OrderCreateSerializer, OrderStatusSerializer

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.role == 'admin':
            return Order.objects.all().order_by('-created_at')

        if user.role == 'vendor':
            from vendors.models import Vendor
            vendor, created = Vendor.objects.get_or_create(
                user=user,
                defaults={
                    'shop_name': f"{user.username}'s Shop",
                    'description': f"Store owned by {user.username}"
                }
            )

            return Order.objects.filter(
                items__product__vendor=vendor
            ).distinct().order_by('-created_at')

        return Order.objects.filter(
            customer=user
        ).order_by('-created_at')

    def create(self, request):
        serializer = OrderCreateSerializer(
            data=request.data,
            context={'request': request}
        )

        if serializer.is_valid():
            order = serializer.save()
            return Response(
                OrderSerializer(order).data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):

        if request.user.role not in ['admin', 'vendor']:
            return Response(
                {'detail': 'Permission denied'},
                status=status.HTTP_403_FORBIDDEN
            )

        order = self.get_object()

        serializer = OrderStatusSerializer(
            order,
            data=request.data,
            partial=True
        )

        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)