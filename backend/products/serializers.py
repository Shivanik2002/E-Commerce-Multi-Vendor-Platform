from rest_framework import serializers
from .models import Product, Category, ProductImage

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model  = Category
        fields = '__all__'

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'is_primary']

class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)

    category_name = serializers.CharField(
        source='category.name',
        read_only=True
    )

    vendor_name = serializers.CharField(
        source='vendor.shop_name',
        read_only=True
    )

    class Meta:
        model = Product
        fields = ['id','name','description','price','stock','category','category_name',
                  'vendor','vendor_name','images','created_at']

        read_only_fields = ['vendor','vendor_name','category_name','created_at']