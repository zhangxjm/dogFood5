import requests
from typing import List, Dict, Any

API_BASE_URL = "http://localhost:8000"


class APIClient:
    def __init__(self):
        self.base_url = API_BASE_URL

    def get_students(self) -> List[Dict[str, Any]]:
        try:
            response = requests.get(f"{self.base_url}/students/")
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException:
            return []

    def create_student(self, student_data: Dict[str, Any]) -> Dict[str, Any]:
        try:
            response = requests.post(f"{self.base_url}/students/", json=student_data)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException:
            return {}

    def update_student(self, student_id: int, student_data: Dict[str, Any]) -> Dict[str, Any]:
        try:
            response = requests.put(f"{self.base_url}/students/{student_id}", json=student_data)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException:
            return {}

    def delete_student(self, student_id: int) -> bool:
        try:
            response = requests.delete(f"{self.base_url}/students/{student_id}")
            response.raise_for_status()
            return True
        except requests.exceptions.RequestException:
            return False

    def get_courses(self) -> List[Dict[str, Any]]:
        try:
            response = requests.get(f"{self.base_url}/courses/")
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException:
            return []

    def create_course(self, course_data: Dict[str, Any]) -> Dict[str, Any]:
        try:
            response = requests.post(f"{self.base_url}/courses/", json=course_data)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException:
            return {}

    def update_course(self, course_id: int, course_data: Dict[str, Any]) -> Dict[str, Any]:
        try:
            response = requests.put(f"{self.base_url}/courses/{course_id}", json=course_data)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException:
            return {}

    def delete_course(self, course_id: int) -> bool:
        try:
            response = requests.delete(f"{self.base_url}/courses/{course_id}")
            response.raise_for_status()
            return True
        except requests.exceptions.RequestException:
            return False

    def get_records(self) -> List[Dict[str, Any]]:
        try:
            response = requests.get(f"{self.base_url}/records/")
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException:
            return []

    def create_record(self, record_data: Dict[str, Any]) -> Dict[str, Any]:
        try:
            response = requests.post(f"{self.base_url}/records/", json=record_data)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException:
            return {}

    def get_schedules(self) -> List[Dict[str, Any]]:
        try:
            response = requests.get(f"{self.base_url}/schedules/")
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException:
            return []

    def get_week_schedules(self) -> List[Dict[str, Any]]:
        try:
            response = requests.get(f"{self.base_url}/schedules/week/")
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException:
            return []

    def create_schedule(self, schedule_data: Dict[str, Any]) -> Dict[str, Any]:
        try:
            response = requests.post(f"{self.base_url}/schedules/", json=schedule_data)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException:
            return {}

    def update_schedule(self, schedule_id: int, schedule_data: Dict[str, Any]) -> Dict[str, Any]:
        try:
            response = requests.put(f"{self.base_url}/schedules/{schedule_id}", json=schedule_data)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException:
            return {}

    def delete_schedule(self, schedule_id: int) -> bool:
        try:
            response = requests.delete(f"{self.base_url}/schedules/{schedule_id}")
            response.raise_for_status()
            return True
        except requests.exceptions.RequestException:
            return False

    def get_statistics(self) -> Dict[str, Any]:
        try:
            response = requests.get(f"{self.base_url}/statistics/hours")
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException:
            return {}


api_client = APIClient()
