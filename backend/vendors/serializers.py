from rest_framework import serializers
from .models import Vendor

class VendorSerializer(serializers.ModelSerializer):
    email      = serializers.CharField(source='user.email', read_only=True)
    username   = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model  = Vendor
        fields = ['id','shop_name','description','is_approved','created_at','email','username']
