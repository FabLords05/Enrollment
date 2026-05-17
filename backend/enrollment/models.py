from django.db import models
from accounts.models import StudentProfile
from academics.models import Term
from scheduling.models import Section
from django.utils import timezone

class EnrollmentRecord(models.Model):
    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE)
    term = models.ForeignKey(Term, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, default='ADVISING') # matches profile status
    date_created = models.DateTimeField(auto_now_add=True)

class EnrolledClass(models.Model):
    enrollment_record = models.ForeignKey(EnrollmentRecord, related_name='classes', on_delete=models.CASCADE)
    section = models.ForeignKey(Section, on_delete=models.CASCADE)

class PaymentTransaction(models.Model):
    student = models.ForeignKey('accounts.StudentProfile', on_delete=models.CASCADE)
    reference_no = models.CharField(max_length=50, unique=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    method = models.CharField(max_length=50) # Cash, GCash, Bank Transfer
    date_paid = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.reference_no} - {self.student.user.last_name}"