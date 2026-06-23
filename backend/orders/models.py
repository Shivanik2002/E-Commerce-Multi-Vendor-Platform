from django.db import models
from users.models import User
from products.models import Product

class Order(models.Model):
    STATUS = (('pending','Pending'),('shipped','Shipped'),('delivered','Delivered'),('cancelled','Cancelled'))
    customer     = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status       = models.CharField(max_length=20, choices=STATUS, default='pending')
    address      = models.TextField()
    created_at   = models.DateTimeField(auto_now_add=True)

    def __str__(self): return f"Order #{self.id} by {self.customer.email}"

class OrderItem(models.Model):
    order    = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product  = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    price    = models.DecimalField(max_digits=10, decimal_places=2)

    def get_subtotal(self):
        return self.quantity * self.price
