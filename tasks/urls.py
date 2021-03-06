from django.urls import path
from . import views

urlpatterns = [
    path('api/list', views.TaskListCreateAPIView.as_view()),
    path('api/list/<int:pk>', views.TaskRetrieveUpdateDeleteAPIView.as_view()),
    path('list', views.TaskListView.as_view(), name='task-list'),
]
