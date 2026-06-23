from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Vendor
from .serializers import VendorSerializer

class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'

class VendorViewSet(viewsets.ModelViewSet):
    queryset           = Vendor.objects.all().order_by('-created_at')
    serializer_class   = VendorSerializer
    permission_classes = [IsAdmin]

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
