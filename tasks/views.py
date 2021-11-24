from django.views.generic import ListView
from rest_framework import generics, mixins, status, permissions
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from .serializers import TaskSerializer
from .models import Task

# Create your views here.
class TaskAPIView(generics.ListCreateAPIView,  mixins.UpdateModelMixin, mixins.DestroyModelMixin):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, ]

    def get_queryset(self):
        return Task.objects.filter(poster=self.request.user.id)
    

    def delete(self, request, *args, **kwargs):
        if self.queryset.filter(id=self.kwargs['pk']).exists():
            self.queryset.get(id=self.kwargs['pk']).delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            raise ValidationError('The task doesn\'t exist!')

    
    def put(self, request, *args, **kwargs):
        if (task := self.queryset.filter(id=self.kwargs['pk'])).exists():
            task = task.update(**request.data.dict())
            return Response(status=status.HTTP_200_OK)
        else:
            raise ValidationError('The task doesn\'t exist!')


class TaskListView(ListView):
    template_name = 'tasks/todo.html'
    queryset = Task.objects.all()
