from django.db import models
import uuid
from django.contrib.auth.models import AbstractUser


class Article(models.Model):
    #投稿情報
    uuid  = models.UUIDField('uuid', primary_key=True, default=uuid.uuid4, editable=False)
    article_owner = models.ForeignKey('app.CustomUser', related_name='article',on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    #論文の基礎情報
    title = models.CharField(verbose_name="文献名", max_length=100)
    author= models.CharField(verbose_name="著者", max_length=20)
    category = models.CharField('カテゴリー名', max_length=15,null=True,blank=True)#空欄OK

    #論文内容のメモ
    abstract= models.CharField(verbose_name="要約",max_length=150)
    image=models.ImageField(verbose_name="画像",upload_to='images',null=True,blank=True)#空欄OK
    body= models.TextField(verbose_name='メモ',null=True,blank=True)#空欄OK
    url=models.URLField(verbose_name='URL',null=True,blank=True)#空欄OK

    #公開設定
    is_open = models.BooleanField(verbose_name='公開する',default=False)

    def __str__(self):
        return self.title


class Likes(models.Model):
    article = models.ForeignKey('Article',on_delete=models.CASCADE)
    user = models.ForeignKey('app.CustomUser', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)


class Analysis(models.Model):
    user = models.ForeignKey('app.CustomUser', on_delete=models.CASCADE)
    number_of_articles_to_read=models.IntegerField(verbose_name="今月読みたい論文数")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class CustomUser(AbstractUser):
    profile_image = models.ImageField(verbose_name='プロフィール画像',upload_to='images',null=True,blank=True)



