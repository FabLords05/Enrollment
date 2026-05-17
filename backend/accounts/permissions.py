from rest_framework.permissions import BasePermission

class IsAdminUserRole(BasePermission):
    def has_permission(self, request, view):
        # Checks if the token belongs to an ADMIN
        return bool(request.user and request.user.role == 'ADMIN')

class IsStudent(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.role == 'STUDENT')

class IsRegistrar(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.role == 'REGISTRAR')
    
class IsCashier(BasePermission):
    """
    Allows access only to users with the CASHIER role.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'CASHIER')