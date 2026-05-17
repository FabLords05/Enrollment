from django.db import models
from enrollment.models import EnrollmentRecord

class Assessment(models.Model):
    enrollment_record = models.OneToOneField(EnrollmentRecord, on_delete=models.CASCADE)
    total_units = models.IntegerField(default=0)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    balance_due = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

class Payment(models.Model):
    assessment = models.ForeignKey(Assessment, related_name='payments', on_delete=models.CASCADE)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2)
    payment_date = models.DateTimeField(auto_now_add=True)
    receipt_number = models.CharField(max_length=100, unique=True)