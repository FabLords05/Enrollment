from rest_framework import serializers

# 1. Import core custom user models
from accounts.models import BaseUser, StudentProfile, ChangeRequest

# 2. Import external app domain models
from scheduling.models import Section
from academics.models import Instructor, Subject, Term
from .models import EnrollmentRecord, EnrolledClass


# --- ADMIN PANEL SERIALIZERS ---

class SectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Section
        fields = '__all__'


class InstructorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Instructor
        fields = '__all__'


class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = '__all__'


class StudentProfileSerializer(serializers.ModelSerializer):
    # Map fields directly from the nested BaseUser account
    email = serializers.EmailField(source='user.email')
    first_name = serializers.CharField(source='user.first_name', required=False, allow_blank=True)
    last_name = serializers.CharField(source='user.last_name', required=False, allow_blank=True)

    class Meta:
        model = StudentProfile
        fields = [
            'id', 
            'email', 
            'student_id', 
            'program_enrolled', 
            'year_level', 
            'enrollment_status', 
            'first_name', 
            'last_name'
        ]

    def create(self, validated_data):
        """Handles creating a new student from the Admin Panel"""
        user_data = validated_data.pop('user')
        password = self.context['request'].data.get('password', 'student123')
        
        # Create the base user account
        user = BaseUser.objects.create_user(
            email=user_data['email'],
            first_name=user_data.get('first_name', ''),
            last_name=user_data.get('last_name', ''),
            role='STUDENT',
            password=password
        )
        
        # Profile is created via signals, so grab it
        profile = user.student_profile
        
        # Save any academic-specific fields
        for attr, value in validated_data.items():
            setattr(profile, attr, value)
        profile.save()
        
        return profile

    def update(self, instance, validated_data):
        """Handles editing an existing student from the Admin Panel"""
        user_data = validated_data.pop('user', {})
        user = instance.user
        
        # Update User model fields
        for attr, value in user_data.items():
            setattr(user, attr, value)
        user.save()
        
        # Update StudentProfile model fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        return instance


class ChangeRequestSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField()

    class Meta:
        model = ChangeRequest
        fields = ['id', 'student', 'student_name', 'message', 'status', 'created_at']

    def get_student_name(self, obj):
        return f"{obj.student.user.email}"


# --- CORE ENROLLMENT & VALIDATION SERIALIZERS ---

class EnrolledClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = EnrolledClass
        fields = ['id', 'enrollment_record', 'subject']

    def validate(self, data):
        subject = data['subject']
        record = data['enrollment_record']

        # 1. Capacity Check
        current_enrollees = EnrolledClass.objects.filter(subject__secId=subject.secId).count()
        if current_enrollees >= subject.secId.slots:
            raise serializers.ValidationError(f"The section {subject.secId.nm} has reached its maximum capacity.")

        # 2. Time Clash Check
        existing_classes = EnrolledClass.objects.filter(enrollment_record=record)
        for ec in existing_classes:
            if ec.subject.days == subject.days:
                if (subject.st < ec.subject.et and subject.et > ec.subject.st):
                    raise serializers.ValidationError(f"Time clash detected! {subject.nm} overlaps with {ec.subject.nm}.")

        return data


class EnrollmentRecordSerializer(serializers.ModelSerializer):
    classes = EnrolledClassSerializer(many=True, read_only=True)

    class Meta:
        model = EnrollmentRecord
        fields = ['id', 'student', 'term', 'status', 'classes', 'date_created']