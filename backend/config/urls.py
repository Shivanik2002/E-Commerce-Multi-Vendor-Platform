from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),

    # Auth APIs
    path('api/auth/', include('users.urls')),

    # User APIs
    path('api/users/', include('users.user_urls')),

    # Vendor APIs
    path('api/vendors/', include('vendors.urls')),

    # Product APIs
    path('api/products/', include('products.urls')),

    # Order APIs
    path('api/orders/', include('orders.urls')),

    # Dashboard APIs
    path('api/dashboard/', include('dashboard.urls')),
]

if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )