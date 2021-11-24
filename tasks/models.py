from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Task(models.Model):
    task = models.TextField(max_length=500)
    details = models.TextField(blank=True)
    poster = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.task
