from django.db import models

class Term(models.Model):
    name = models.CharField(max_length=100) # e.g., "AY 2026-2027, 1st Semester"
    is_active = models.BooleanField(default=False)

    def __str__(self):
        return self.name

class Course(models.Model):
    code = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=200)
    units = models.IntegerField(default=3)
    prerequisites = models.ManyToManyField('self', symmetrical=False, blank=True)

    def __str__(self):
        return f"{self.code} - {self.name}"

class Instructor(models.Model):
    nm = models.CharField(max_length=100, verbose_name="Full Name")
    email = models.EmailField(unique=True)
    dept = models.CharField(max_length=50, blank=True, null=True, verbose_name="Department")
    spec = models.CharField(max_length=100, blank=True, null=True, verbose_name="Specialization")

    def __str__(self):
        return self.nm

class Subject(models.Model):
    nm = models.CharField(max_length=100, verbose_name="Subject Title")
    
    # CRITICAL FIX: We use a string reference here to eliminate the circular dependency!
    secId = models.ForeignKey('scheduling.Section', on_delete=models.CASCADE, related_name="subjects")
    
    units = models.IntegerField(default=3)
    days = models.CharField(max_length=50) 
    st = models.CharField(max_length=20) 
    et = models.CharField(max_length=20) 
    room = models.CharField(max_length=50)
    instId = models.ForeignKey(Instructor, on_delete=models.SET_NULL, null=True, blank=True, related_name="subjects")

    def __str__(self):
        return f"{self.nm} ({self.secId.name})"  # 🟢 Fixed to match Section model