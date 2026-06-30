from rest_framework import serializers
from .models import User

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model  = User
        fields = ['id', 'username', 'email', 'password', 'role', 'phone']

    def create(self, validated_data):
        user = User.objects.create_user(
            email    = validated_data['email'],
            username = validated_data['username'],
            password = validated_data['password'],
            role     = validated_data.get('role', 'customer'),
        )
        if user.role == 'vendor':
            from vendors.models import Vendor
            Vendor.objects.get_or_create(
                user=user,
                defaults={
                    'shop_name': f"{user.username}'s Shop",
                    'description': f"Store owned by {user.username}"
                }
            )
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model  = User
        fields = ['id', 'username', 'email', 'role', 'phone', 'address']
        read_only_fields = ['role']
