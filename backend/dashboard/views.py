from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from users.models import User
from products.models import Product
from orders.models import Order
from django.db.models import Sum

class DashboardStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.role == 'vendor':
            try:
                vendor = user.vendor_profile
                products = Product.objects.filter(vendor=vendor)
                orders   = Order.objects.filter(items__product__vendor=vendor).distinct()
                revenue  = orders.filter(status='delivered').aggregate(t=Sum('total_amount'))['t'] or 0
                return Response({
                    'products': products.count(),
                    'orders':   orders.count(),
                    'revenue':  revenue,
                    'pending':  orders.filter(status='pending').count(),
                })
            except:
                return Response({'products':0,'orders':0,'revenue':0,'pending':0})

        if user.role == 'admin':
            revenue = Order.objects.filter(status='delivered').aggregate(t=Sum('total_amount'))['t'] or 0
            return Response({
                'users':     User.objects.count(),
                'vendors':   User.objects.filter(role='vendor').count(),
                'customers': User.objects.filter(role='customer').count(),
                'products':  Product.objects.count(),
                'orders':    Order.objects.count(),
                'revenue':   revenue,
                'pending_orders': Order.objects.filter(status='pending').count(),
            })

        # customer
        orders = Order.objects.filter(customer=user)
        return Response({
            'orders':    orders.count(),
            'pending':   orders.filter(status='pending').count(),
            'delivered': orders.filter(status='delivered').count(),
            'spent':     orders.aggregate(t=Sum('total_amount'))['t'] or 0,
        })
