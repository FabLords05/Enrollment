import os
import random
from datetime import time

import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ems_backend.settings')
django.setup()

from accounts.models import BaseUser
from academics.models import Course, Instructor, Subject, Term, ClassOffering
from scheduling.models import Section


def clear_seeded_data():
    print('Clearing existing seeded academic and schedule data...')
    ClassOffering.objects.all().delete()
    Subject.objects.all().delete()
    Section.objects.all().delete()
    Instructor.objects.all().delete()
    Course.objects.all().delete()
    Term.objects.all().delete()
    BaseUser.objects.filter(role__in=[
        BaseUser.Role.ADMIN,
        BaseUser.Role.REGISTRAR,
        BaseUser.Role.CASHIER,
        BaseUser.Role.STUDENT,
    ]).delete()


def create_user(email, role, password, first_name='', last_name='', is_staff=False, is_superuser=False):
    user, created = BaseUser.objects.get_or_create(
        email=email,
        defaults={
            'role': role,
            'first_name': first_name,
            'last_name': last_name,
            'is_staff': is_staff,
            'is_superuser': is_superuser,
        }
    )

    if created or user.role != role or user.first_name != first_name or user.last_name != last_name or user.is_staff != is_staff or user.is_superuser != is_superuser:
        user.role = role
        user.first_name = first_name
        user.last_name = last_name
        user.is_staff = is_staff
        user.is_superuser = is_superuser
        user.set_password(password)
        user.save()
    elif not user.check_password(password):
        user.set_password(password)
        user.save()

    return user


def seed_database():
    print('🌱 Starting database seeding process...')
    random.seed(42)

    clear_seeded_data()

    print('Creating core staff accounts...')
    create_user(
        email='admin@gmail.com',
        role=BaseUser.Role.ADMIN,
        password='admin123',
        first_name='System',
        last_name='Admin',
        is_staff=True,
        is_superuser=True,
    )
    create_user(
        email='registrar@gmail.com',
        role=BaseUser.Role.REGISTRAR,
        password='registrar123',
        first_name='Regina',
        last_name='Registrar',
    )
    create_user(
        email='cashier@gmail.com',
        role=BaseUser.Role.CASHIER,
        password='cashier123',
        first_name='Cory',
        last_name='Cashier',
    )

    print('Creating degree programs...')
    programs = {
        'BSIT': Course.objects.create(
            code='BSIT',
            name='Bachelor of Science in Information Technology',
            units=180,
        ),
        'BSTCM': Course.objects.create(
            code='BSTCM',
            name='Bachelor of Science in Tourism and Convention Management',
            units=180,
        ),
        'BSCpE': Course.objects.create(
            code='BSCpE',
            name='Bachelor of Science in Computer Engineering',
            units=180,
        ),
    }

    print('Creating academic term...')
    term = Term.objects.create(name='AY 2026-2027, 1st Semester', is_active=True)

    print('Creating sections...')
    sections = {
        'BSIT-1A': Section.objects.create(term=term, course=programs['BSIT'], name='BSIT-1A', capacity=40),
        'BSIT-1B': Section.objects.create(term=term, course=programs['BSIT'], name='BSIT-1B', capacity=40),
        'BSTCM-1A': Section.objects.create(term=term, course=programs['BSTCM'], name='BSTCM-1A', capacity=40),
        'BSCpE-1A': Section.objects.create(term=term, course=programs['BSCpE'], name='BSCpE-1A', capacity=40),
    }

    print('Creating instructors...')
    instructors = {
        'Maria Santos': Instructor.objects.create(
            nm='Dr. Maria Santos',
            email='maria.santos@school.edu',
            dept='Information Technology',
            spec='Software Engineering',
        ),
        'John Reyes': Instructor.objects.create(
            nm='Prof. John Reyes',
            email='john.reyes@school.edu',
            dept='Mathematics',
            spec='Discrete Mathematics',
        ),
        'Angela Cruz': Instructor.objects.create(
            nm='Prof. Angela Cruz',
            email='angela.cruz@school.edu',
            dept='Humanities',
            spec='Communication Arts',
        ),
        'Leo Tan': Instructor.objects.create(
            nm='Dr. Leo Tan',
            email='leo.tan@school.edu',
            dept='Engineering',
            spec='Computer Networks',
        ),
        'Nina Lim': Instructor.objects.create(
            nm='Prof. Nina Lim',
            email='nina.lim@school.edu',
            dept='Science',
            spec='Physical Science',
        ),
    }

    print('Creating subject catalog...')
    subject_data = [
        ('IT 111', 'Computer Fundamentals', 3),
        ('IT 112', 'Programming Logic and Design', 3),
        ('IT 211', 'Data Structures and Algorithms', 3),
        ('IT 322', 'Database Management Systems', 3),
        ('MATH 101', 'College Algebra', 3),
        ('MATH 102', 'Trigonometry', 3),
        ('ENG 101', 'Purposive Communication', 3),
        ('NSTP 1', 'National Service Training Program 1', 3),
        ('PHYS 1', 'Physics with Calculus', 3),
        ('HUMSS 1', 'Ethics and Values Education', 3),
    ]

    subjects = {}
    for code, name, units in subject_data:
        subjects[code] = Subject.objects.create(code=code, name=name, units=units)

    print('Creating class offerings...')
    offering_data = [
        (subjects['IT 111'], sections['BSIT-1A'], instructors['Maria Santos'], 'MWF', '08:00:00', '09:00:00', 'IT 201'),
        (subjects['IT 112'], sections['BSIT-1A'], instructors['John Reyes'], 'TTH', '09:00:00', '10:30:00', 'IT 201'),
        (subjects['ENG 101'], sections['BSIT-1A'], instructors['Angela Cruz'], 'MWF', '10:00:00', '11:00:00', 'AH 105'),
        (subjects['IT 211'], sections['BSIT-1B'], instructors['Leo Tan'], 'MWF', '08:00:00', '09:00:00', 'IT 202'),
        (subjects['IT 322'], sections['BSIT-1B'], instructors['Maria Santos'], 'TTH', '09:00:00', '10:30:00', 'IT 202'),
        (subjects['MATH 101'], sections['BSTCM-1A'], instructors['John Reyes'], 'MWF', '11:00:00', '12:00:00', 'MATH 101'),
        (subjects['NSTP 1'], sections['BSTCM-1A'], instructors['Nina Lim'], 'TTH', '13:00:00', '14:30:00', 'MPH 201'),
        (subjects['PHYS 1'], sections['BSCpE-1A'], instructors['Leo Tan'], 'MWF', '08:00:00', '09:00:00', 'PHY 101'),
        (subjects['HUMSS 1'], sections['BSCpE-1A'], instructors['Angela Cruz'], 'TTH', '10:30:00', '12:00:00', 'AH 102'),
        (subjects['MATH 102'], sections['BSIT-1B'], instructors['John Reyes'], 'MWF', '13:00:00', '14:00:00', 'MATH 102'),
    ]

    for subject, section, instructor, days, start_time, end_time, room in offering_data:
        ClassOffering.objects.create(
            subject=subject,
            section=section,
            instructor=instructor,
            days=days,
            start_time=time.fromisoformat(start_time),
            end_time=time.fromisoformat(end_time),
            room=room,
        )

    print('Creating student accounts with profiles...')
    statuses = ['ADVISING', 'ASSESSED', 'PAID', 'ENROLLED']
    section_list = list(sections.values())
    program_choices = list(programs.values())

    for idx in range(1, 21):
        email = f'student{idx:02d}@school.edu'
        student = create_user(
            email=email,
            role=BaseUser.Role.STUDENT,
            password='student123',
            first_name=f'Student{idx:02d}',
            last_name='Test',
        )

        profile = getattr(student, 'student_profile', None)
        if profile is None:
            from accounts.models import StudentProfile
            profile = StudentProfile.objects.create(user=student)

        profile.student_id = f'2026-{idx:04d}'
        profile.program_enrolled = program_choices[(idx - 1) % len(program_choices)]
        profile.section = section_list[(idx - 1) % len(section_list)]
        profile.enrollment_status = random.choice(statuses)
        profile.year_level = random.choice([1, 2, 3, 4])
        profile.phone = f'0917{1000000 + idx:07d}'
        profile.save()

    print('✅ Seed process completed successfully.')
    print('Login credentials:')
    print('  Admin: admin@gmail.com / admin123')
    print('  Registrar: registrar@gmail.com / registrar123')
    print('  Cashier: cashier@gmail.com / cashier123')
    print('  Students: student01@school.edu through student20@school.edu / student123')


if __name__ == '__main__':
    seed_database()
