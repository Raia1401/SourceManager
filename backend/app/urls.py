from django.urls import re_path, include,path
from rest_framework import routers

from .views import MyArticleModelViewSet,AllUserArticleModelViewSet,\
                   LikesPostAPIView,LikesDeleteAPIView,\
                   AnalysisGetOrPostAPIView,\
                   UserGetOrPostAPIView,UserUpdateAPIView

from rest_framework_jwt.views import obtain_jwt_token, verify_jwt_token, refresh_jwt_token


# Create a router and register our viewsets with it.
router = routers.DefaultRouter()
router.register(r'my-articles', MyArticleModelViewSet)


urlpatterns = [
    re_path(r'^', include(router.urls)),
    re_path(r'^api/', include('rest_framework.urls', namespace='rest_framework')),
    path('all-user-articles/',AllUserArticleModelViewSet.as_view({'get': 'list'}),name="all_user_articles"),
    #ユーザー情報
    path('user/', UserGetOrPostAPIView.as_view()),
    path('user/<int:pk>/', UserUpdateAPIView.as_view()),
    #いいねカウント
    path('likes/', LikesPostAPIView.as_view()),
    path('likes/<int:pk>/', LikesDeleteAPIView.as_view()),
    #Homeページ
    path('analysis/', AnalysisGetOrPostAPIView.as_view()),
    #JWTトークン
    path('api/token/', obtain_jwt_token), 
    path('api/token/verify/', verify_jwt_token), 
    path('api/token/refresh/', refresh_jwt_token),
]
