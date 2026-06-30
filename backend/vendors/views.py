from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Vendor
from .serializers import VendorSerializer

class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and request.user.role == 'admin'

class VendorViewSet(viewsets.ModelViewSet):
    serializer_class   = VendorSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and user.role == 'admin':
            return Vendor.objects.all().order_by('-created_at')
        return Vendor.objects.filter(is_approved=True).order_by('-created_at')

    @action(detail=True, methods=['patch'])
    def approve(self, request, pk=None):
        vendor = self.get_object()
        vendor.is_approved = True
        vendor.save()
        return Response({'status': 'approved'})

    @action(detail=True, methods=['patch'])
    def reject(self, request, pk=None):
        vendor = self.get_object()
        vendor.is_approved = False
        vendor.save()
        return Response({'status': 'rejected'})
