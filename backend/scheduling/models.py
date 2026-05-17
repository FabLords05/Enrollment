from django.db import models
from academics.models import Course, Term

class Room(models.Model):
    name = models.CharField(max_length=50)

class TimeSlot(models.Model):
    day_of_week = models.CharField(max_length=20) # e.g., "MWF", "TTh"
    start_time = models.TimeField()
    end_time = models.TimeField()

class Section(models.Model):
    term = models.ForeignKey(Term, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    name = models.CharField(max_length=50)
    capacity = models.IntegerField(default=40)
    room = models.ForeignKey(Room, on_delete=models.SET_NULL, null=True)
    time_slot = models.ForeignKey(TimeSlot, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return f"{self.course.code} - {self.name}"