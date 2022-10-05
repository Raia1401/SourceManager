from django.test import TestCase, Client
from app.models import Article,CustomUser

# Create your tests here.

class ArticleModelTest(TestCase):

    def test_is_count_one(self):
        # 一つだけデータを登録　(正常系)
        CustomUser.objects.create_user('tester')
        user=CustomUser.objects.get(username='tester')
        article=Article(article_owner=user,title='1',author='1',abstract='1')
        article.save()
        saved_article =Article.objects.all()
        self.assertEqual(saved_article.count(), 1)

    # def test_is_empty(self):
    #     # 一つだけデータを登録　(正常系)
    #     CustomUser.objects.create_user('tester')
    #     user=CustomUser.objects.get(username='tester')
    #     article=Article(article_owner=user)
    #     article.save()
    #     saved_article =Article.objects.all()
    #     self.assertEqual(saved_article.count(), 1)


class CustomUserModelTest(TestCase):

    def test_is_count_one(self):
        CustomUser.objects.create_user('tester')
        saved_user =CustomUser.objects.all()
        self.assertEqual(saved_user.count(), 1)
        