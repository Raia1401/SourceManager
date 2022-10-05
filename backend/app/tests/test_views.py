from django.test import TestCase
from rest_framework.test import APITestCase

# Create your tests here.

class TestMyArticleView(APITestCase):

    TARGET_URL='/my-articles/'