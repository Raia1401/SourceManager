import datetime
from functools import partial
from logging import raiseExceptions
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status, viewsets
from django.db.models import Q

from .models import Article,Likes,Analysis,CustomUser
from .serializers import CreateUserSerializer,UserSerializer,ArticleSerializer,LikesSerializer, AnalysisSerializer
from django.conf import settings

#Permission関係
from rest_framework import permissions
from .permissions import IsOwnerOrReadOnly,IsAuthenticatedExceptWhenMethodIsPost
from django.db.models import Count


class MyArticleModelViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.
    """
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer

    #認証してなければできない
    permission_classes =[permissions.IsAuthenticated,IsOwnerOrReadOnly]

    # 記事一覧取得
    def list(self, request):

        article_object=Article.objects.select_related('article_owner')
        article_object=article_object.filter(article_owner=request.user).order_by('created_at').reverse()
        article_data = ArticleSerializer(article_object, many=True).data
        article_object.prefetch_related('Likes')

        article_object=article_object.annotate(Count('likes'))

        for i,article in enumerate(article_object):
            likes_count=article.likes__count
            likes_data_of_requestuser=article.likes_set.filter(user=request.user).values()
            article_data[i]['likes_count']=likes_count
            article_data[i]['likes_data_of_requestuser']=likes_data_of_requestuser
        
        return Response(status=200, data=article_data) 

    # 記事詳細取得
    def retrieve(self, request, pk=None):
        data = ArticleSerializer(Article.objects.filter(uuid=pk), many=True).data
        data[0]['login_user']=str(request.user)
        return Response(status=200, data=data)
    
    # 記事追加
    def create(self, request):
        
        #論文の基礎情報
        title_data=request.data['title']
        author_data=request.data['author']
        category_data=request.data['category']

        #論文内容メモ
        abstract_data=request.data['abstract']
        body_data=request.data['body']
        url_data=request.data['url']
        image_data = request.data['image']

        #記事の公開設定
        is_open_data=self.str2bool(request.data['isOpen'])

        article = Article.objects.create(title=title_data, author=author_data, category=category_data,\
                                         abstract=abstract_data, body=body_data,url=url_data, image=image_data,\
                                         is_open=is_open_data, article_owner=request.user)

        serializer = ArticleSerializer(article, many=False)
        response = {'message': 'Article created' , 'result': serializer.data}
        return Response(response, status=200)
    

    #Article側で、データを作成したUserが取得できるように
    def perform_create(self, serializer):
        serializer.save(article_owner=self.request.user.username)
    

    def str2bool(self,str):
        if str=='true':
            return True
        elif str=='false':
            return False
        else:
            raise ValueError("This str cant convert to bool")


class AllUserArticleModelViewSet(viewsets.ReadOnlyModelViewSet):
    """
    This viewset automatically provides `list` actions.
    """
    queryset = Article.objects.all()
    serializer_class =ArticleSerializer

    # 記事一覧取得
    def list(self, request):
        article_obj=Article.objects.filter(is_open=True).order_by('created_at').reverse()
        article_data = ArticleSerializer(article_obj, many=True).data
        article_obj.prefetch_related('Likes')

        for i,article in enumerate(article_obj.annotate(Count('likes'))):
            likes_count=article.likes__count
            likes_data_of_requestuser=Likes.objects.filter(article=article.uuid, user=request.user).values()
            article_data[i]['likes_count']=likes_count
            article_data[i]['likes_data_of_requestuser']=likes_data_of_requestuser

        return Response(status=200, data=article_data)

    def retrieve(self, request, pk=None):
        pass

    
class LikesPostAPIView(APIView):        
    def post(self, request, format=None):
        likes={'article':request.data['uuid'],'user':request.user.id}
        serializer = LikesSerializer(data=likes)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED) 

class LikesDeleteAPIView(APIView):
    def delete(self, request, pk, format=None):
        likes=get_object_or_404(Likes,pk=pk)
        likes.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class UserGetOrPostAPIView(APIView):

    permission_classes = (IsAuthenticatedExceptWhenMethodIsPost, )

    #ユーザー情報取得
    def get(self,request):

        username=request.query_params.get('username')
        if username is None:
            username = request.user.username

        user_info=CustomUser.objects.filter(username=username).values('username','id','profile_image')[0]
        
        if not user_info:
            return Response({'response':'error','message':'No user found'},status=status.HTTP_400_BAD_REQUEST)
        
        #FIXME：URLを足さないといけない
        if user_info['profile_image']:
            MEDIA_URL = getattr(settings, "MEDIA_URL", None)[1:]
            user_info['profile_image']= MEDIA_URL + user_info['profile_image']

        return Response(user_info,status=200)

    #ユーザーの新規作成
    def post(self,request):
        username = request.data.get('username')
        password = request.data.get('password')
        user ={'username':username,'password':password}
        if not user:
            return Response({'response':'error','message':'No user found'},status=status.HTTP_400_BAD_REQUEST)
        serializer = CreateUserSerializer(data = user)
        if serializer.is_valid():
            serializer.save()
        else:
            return Response({"response":"error", "message":serializer.errors},status=status.HTTP_400_BAD_REQUEST)
        return Response({"response" : "success", "message" : "user created succesfully"})
    
    def get_profile_image():
        pass
    

class UserUpdateAPIView(APIView):

    permission_classes =(permissions.IsAuthenticated,)

    def patch(self,request,pk,*args, **kwargs):
        #MEDIA_URL = str(getattr(settings, "MEDIA_URL", None))

        user=get_object_or_404(CustomUser,pk=pk)
        profile_image={'profile_image': request.data.get('profile_image')}
        # print(profile_image)
        serializer=UserSerializer(instance=user,data=profile_image,partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data,status=200)

class AnalysisGetOrPostAPIView(APIView):

    def get(self,request):
        analysis_data={'articles_created_dates':[]}

        #文献を登録した日付のリストを取得,重複許す
        articles=Article.objects.filter(article_owner=request.user)
        for article in articles:
            analysis_data['articles_created_dates'].append(article.created_at.strftime('%Y%m%d'))

        #今月登録した文献数を取得
        current_date_time=datetime.datetime.now().date()
        number_of_articles_in_this_month=articles.filter(created_at__year=current_date_time.strftime("%Y"),\
                                                         created_at__month=current_date_time.strftime("%m")).count()
        analysis_data['number_of_articles_in_this_month']=number_of_articles_in_this_month

        #今月読みたい論文目標数を取得
        number_of_articles_to_read=list(Analysis.objects.filter(user=request.user,\
                                                           created_at__month=current_date_time.strftime("%m")).values('number_of_articles_to_read'))
        
        if len(number_of_articles_to_read):
            analysis_data.update(number_of_articles_to_read[0])
        else:
            analysis_data.update({'number_of_articles_to_read':None})

        return Response(analysis_data)
    
    def post(self, request, format=None):
        #今月読みたい論文目標数を更新
        created_data={'user':request.user.id,'number_of_articles_to_read':request.data['number_of_articles_to_read']}
        serializer = AnalysisSerializer(data=created_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
