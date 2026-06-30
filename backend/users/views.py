from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import User
from .serializers import RegisterSerializer, UserSerializer

class RegisterView(generics.CreateAPIView):
    queryset         = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        data = UserSerializer(request.user).data
        if request.user.role == 'vendor':
            from vendors.models import Vendor
            vendor, created = Vendor.objects.get_or_create(user=request.user)
            data['shop_name'] = vendor.shop_name
            data['description'] = vendor.description
        return Response(data)

    def patch(self, request):
        user = request.user
        serializer = UserSerializer(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        if user.role == 'vendor':
            from vendors.models import Vendor
            vendor, created = Vendor.objects.get_or_create(user=user)
            if 'shop_name' in request.data:
                vendor.shop_name = request.data['shop_name']
            if 'description' in request.data:
                vendor.description = request.data['description']
            vendor.save()

        # Build response representation
        data = UserSerializer(user).data
        if user.role == 'vendor':
            data['shop_name'] = vendor.shop_name
            data['description'] = vendor.description
        return Response(data)

class UserListView(generics.ListAPIView):
    queryset = User.objects.all().order_by('-id')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

