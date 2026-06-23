from rest_framework import serializers
from .models import Order, OrderItem
from products.models import Product

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    subtotal     = serializers.SerializerMethodField()

    class Meta:
        model  = OrderItem
        fields = ['id','product','product_name','quantity','price','subtotal']

    def get_subtotal(self, obj):
        return obj.get_subtotal()

class OrderItemCreateSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity   = serializers.IntegerField(min_value=1)

class OrderCreateSerializer(serializers.Serializer):
    items   = OrderItemCreateSerializer(many=True)
    address = serializers.CharField()

    def create(self, validated_data):
        customer = self.context['request'].user
        items_data = validated_data.pop('items')
        total = 0
        item_objects = []
        for item in items_data:
            product = Product.objects.get(id=item['product_id'])
            subtotal = product.price * item['quantity']
            total += subtotal
            item_objects.append({'product': product, 'quantity': item['quantity'], 'price': product.price})
        order = Order.objects.create(customer=customer, total_amount=total, address=validated_data['address'])
        for i in item_objects:
            OrderItem.objects.create(order=order, **i)
            i['product'].stock -= i['quantity']
            i['product'].save()
        return order

class OrderSerializer(serializers.ModelSerializer):
    items            = OrderItemSerializer(many=True, read_only=True)
    customer_email   = serializers.CharField(source='customer.email', read_only=True)

    class Meta:
        model  = Order
        fields = ['id','customer','customer_email','total_amount','status','address','created_at','items']


class OrderStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['status']