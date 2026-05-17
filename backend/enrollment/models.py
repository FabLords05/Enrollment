from django.db import models
from accounts.models import StudentProfile
from academics.models import Term
from scheduling.models import Section

class EnrollmentRecord(models.Model):
    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE)
    term = models.ForeignKey(Term, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, default='ADVISING') # matches profile status
    date_created = models.DateTimeField(auto_now_add=True)

class EnrolledClass(models.Model):
    enrollment_record = models.ForeignKey(EnrollmentRecord, related_name='classes', on_delete=models.CASCADE)
    section = models.ForeignKey(Section, on_delete=models.CASCADE)