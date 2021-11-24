from django.views.generic import ListView
from rest_framework import generics, permissions
from .serializers import TaskSerializer
from .models import Task

# Create your views here.
class TaskListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(poster=self.request.user)


    def perform_create(self, serializer):
        serializer.save(poster=self.request.user)


class TaskRetrieveUpdateDeleteAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(poster=self.request.user, id=self.kwargs['pk'])


class TaskListView(ListView):
    template_name = 'tasks/todo.html'
    
    def get_queryset(self):
        return Task.objects.filter(poster=self.request.user)
