from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True
        
            # Write permissions are only allowed to the owner of the snippet.
        return obj.article_owner == request.user


class IsAuthenticatedExceptWhenMethodIsPost(permissions.BasePermission):
    """
    Custom permission to allow authenticated user to edit object, except when they create new data.
    """
    def has_permission(self, request, view):
        if request.method == 'POST': 
            return True
        return bool(request.user and request.user.is_authenticated)
        