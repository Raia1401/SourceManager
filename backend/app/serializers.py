from rest_framework import serializers
from .models import Article,Likes,CustomUser,Analysis#,Category

from rest_framework_jwt.settings import api_settings #追加
from django.contrib.auth.models import User #追加
#from django.contrib.auth import get_user_model
#User = get_user_model()

from django.core import exceptions
import django.contrib.auth.password_validation as validators


class CreateUserSerializer(serializers.ModelSerializer):
    token = serializers.SerializerMethodField()
    password = serializers.CharField(write_only=True)

    def get_token(self, obj):
        jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
        jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

        payload = jwt_payload_handler(obj)
        token = jwt_encode_handler(payload)
        return token

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance
    
    def validate(self, data):
         # here data has all the fields which have validated values
         # so we can create a User instance out of it
         user = User(**data)
         password=data['password']
         errors = dict() 
         try:
             # validate the password and catch the exception
             validators.validate_password(password=password, user=user)
         except exceptions.ValidationError as e:
             errors['password'] = list(e.messages)
         if errors:
             raise serializers.ValidationError(errors)
         return data

    class Meta:
        model = CustomUser
        fields = ('token', 'username', 'password')

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = CustomUser
        fields = ['id','username','profile_image'] 


class ArticleSerializer(serializers.ModelSerializer):
    #ownerを変更させないように登録する
    article_owner =serializers.ReadOnlyField(source='article_owner.username')#owner.username
    class Meta:
        model = Article
        fields = ['uuid','article_owner',\
                 'title', 'author','category', \
                 'abstract','image','body', 'url',\
                 'is_open'] 

        read_only_fields = ('created_at', 'updated_at')


class LikesSerializer(serializers.ModelSerializer):
    class Meta:
        model =Likes
        fields=['article','user']
        read_only_fields = ('created_at',)


class AnalysisSerializer(serializers.ModelSerializer):
    #owner =serializers.ReadOnlyField(source='article_owner.username')
    class Meta:
        model = Analysis
        fields=['user','number_of_articles_to_read']
        read_only_fields = ('created_at','updated_at',)




