from django.core.management.base import BaseCommand
from academics.models import Term, Course, Instructor, Subject
from scheduling.models import Section

class Command(BaseCommand):
    help = "Seeds the database with subjects and block schedules matching the UI configuration"

    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING("Starting database schedule seeding..."))

        # 1. Seed Academic Term (Matches the top-right UI tag 'SY 2025-2026')
        term, _ = Term.objects.get_or_create(
            name="SY 2025-2026",
            defaults={"is_active": True}
        )

        # 2. Seed Core Program Course Curriculum
        course, _ = Course.objects.get_or_create(
            code="BSIT", 
            defaults={
                "name": "Bachelor of Science in Information Technology",
                "units": 3
            }
        )

        # 3. Seed Target Block Cohort (Uses '.name' to match your explicit Section model)
        section, _ = Section.objects.get_or_create(
            name="BSIT-1A",
            term=term,
            course=course,
            defaults={"capacity": 40}
        )

        # 4. Seed Instructor Registry (Uses '.nm' to match your explicit Instructor model)
        instructor_dataset = [
            {"nm": "Prof. Santos", "email": "santos@ustp.edu.ph"},
            {"nm": "Prof. Reyes", "email": "reyes@ustp.edu.ph"},
            {"nm": "Prof. Cruz", "email": "cruz@ustp.edu.ph"},
            {"nm": "Prof. Dela Cruz", "email": "delacruz@ustp.edu.ph"},
            {"nm": "Prof. Tan", "email": "tan@ustp.edu.ph"},
            {"nm": "Prof. Lim", "email": "lim@ustp.edu.ph"},
            {"nm": "Prof. Garcia", "email": "garcia@ustp.edu.ph"}
        ]
        
        instructors = {}
        for inst_data in instructor_dataset:
            inst, _ = Instructor.objects.get_or_create(
                email=inst_data["email"],
                defaults={"nm": inst_data["nm"]}
            )
            instructors[inst_data["nm"]] = inst

        # 5. Seed Subject Blocks (Uses '.nm' and '.secId' to match your explicit Subject model)
        subject_catalog = [
            {
                "nm": "CS 101 - Introduction to Computing",
                "units": 3,
                "days": "MWF",
                "st": "07:30 AM",
                "et": "08:30 AM",
                "room": "IT 201",
                "instructor": "Prof. Santos"
            },
            {
                "nm": "MATH 101 - Mathematics in the Modern World",
                "units": 3,
                "days": "TTh",
                "st": "09:00 AM",
                "et": "10:30 AM",
                "room": "SB 104",
                "instructor": "Prof. Reyes"
            },
            {
                "nm": "ENG 101 - Purposive Communication",
                "units": 3,
                "days": "MWF",
                "st": "10:30 AM",
                "et": "11:30 AM",
                "room": "AH 302",
                "instructor": "Prof. Cruz"
            },
            {
                "nm": "CS 102 - Computer Programming 1",
                "units": 3,
                "days": "TTh",
                "st": "01:00 PM",
                "et": "02:30 PM",
                "room": "CL 101",
                "instructor": "Prof. Tan"
            },
            {
                "nm": "STS 101 - Science, Technology and Society",
                "units": 3,
                "days": "MWF",
                "st": "01:30 PM",
                "et": "02:30 PM",
                "room": "AH 201",
                "instructor": "Prof. Lim"
            },
            {
                "nm": "PE 101 - Physical Education 1",
                "units": 2,
                "days": "Fri",
                "st": "03:00 PM",
                "et": "05:00 PM",
                "room": "Gym",
                "instructor": "Prof. Dela Cruz"
            },
            {
                "nm": "NSTP 101 - National Service Training Program",
                "units": 3,
                "days": "Sat",
                "st": "07:00 AM",
                "et": "12:00 PM",
                "room": "MPH",
                "instructor": "Prof. Garcia"
            }
        ]

        # 6. Execute Idempotent Storage Loop
        for sub_data in subject_catalog:
            Subject.objects.update_or_create(
                nm=sub_data["nm"],
                secId=section,
                defaults={
                    "units": sub_data["units"],
                    "days": sub_data["days"],
                    "st": sub_data["st"],
                    "et": sub_data["et"],
                    "room": sub_data["room"],
                    "instId": instructors[sub_data["instructor"]]
                }
            )

        self.stdout.write(self.style.SUCCESS("Successfully seeded block section timetable metrics!"))