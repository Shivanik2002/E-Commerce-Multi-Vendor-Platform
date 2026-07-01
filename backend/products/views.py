from rest_framework import viewsets, permissions
from .models import Product, Category, ProductImage
from .serializers import ProductSerializer, CategorySerializer

class IsVendorOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and request.user.role == 'vendor'

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.vendor.user == request.user

class ProductViewSet(viewsets.ModelViewSet):
    serializer_class   = ProductSerializer
    permission_classes = [IsVendorOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and user.role == 'vendor':
            qs = Product.objects.filter(vendor__user=user)
        else:
            qs = Product.objects.filter(is_active=True)
        
        qs = qs.order_by('-created_at')
        search   = self.request.query_params.get('search')
        category = self.request.query_params.get('category')
        vendor   = self.request.query_params.get('vendor')
        if search:   qs = qs.filter(name__icontains=search)
        if category: qs = qs.filter(category__slug=category)
        if vendor:   qs = qs.filter(vendor__id=vendor)
        return qs

    def perform_create(self, serializer):
        from vendors.models import Vendor
        vendor, created = Vendor.objects.get_or_create(
            user=self.request.user,
            defaults={
                'shop_name': f"{self.request.user.username}'s Shop",
                'description': f"Store owned by {self.request.user.username}"
            }
        )
        product = serializer.save(vendor=vendor)

        images = self.request.FILES.getlist('images')

        for image in images:
            ProductImage.objects.create(
                product=product,
                image=image
            )

class CategoryViewSet(viewsets.ModelViewSet):
    queryset           = Category.objects.all()
    serializer_class   = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
