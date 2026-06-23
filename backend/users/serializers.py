from rest_framework import serializers
from .models import User

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model  = User
        fields = ['id', 'username', 'email', 'password', 'role', 'phone']

    def create(self, validated_data):
        return User.objects.create_user(
            email    = validated_data['email'],
            username = validated_data['username'],
            password = validated_data['password'],
            role     = validated_data.get('role', 'customer'),
        )

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model  = User
        fields = ['id', 'username', 'email', 'role', 'phone', 'address']
