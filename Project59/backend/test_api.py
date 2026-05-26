import urllib.request
import json

BASE_URL = "http://localhost:8000"

def test_endpoint(url, method="GET", data=None):
    try:
        req = urllib.request.Request(
            f"{BASE_URL}{url}",
            method=method,
            headers={"Content-Type": "application/json"}
        )
        if data:
            req.data = json.dumps(data).encode()
        
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode())
    except Exception as e:
        return f"Error: {str(e)}"

print("=" * 60)
print("API Testing - Music School Booking System")
print("=" * 60)

print("\n1. Health Check")
result = test_endpoint("/api/health")
print(f"   Result: {result}")

print("\n2. Get All Courses")
result = test_endpoint("/api/courses")
if isinstance(result, list):
    print(f"   Found {len(result)} courses:")
    for course in result[:3]:
        print(f"   - {course['name']} ({course['instrument']})")
else:
    print(f"   Error: {result}")

print("\n3. Get Instruments")
result = test_endpoint("/api/courses/instruments")
print(f"   Result: {result}")

print("\n4. Get All Bookings")
result = test_endpoint("/api/bookings")
if isinstance(result, list):
    print(f"   Found {len(result)} bookings")
else:
    print(f"   Error: {result}")

print("\n5. Get Statistics")
result = test_endpoint("/api/records/stats")
print(f"   Statistics:")
for k, v in result.items():
    print(f"   - {k}: {v}")

print("\n6. Get Lesson Records")
result = test_endpoint("/api/records/")
if isinstance(result, list):
    print(f"   Found {len(result)} records")
else:
    print(f"   Error: {result}")

print("\n7. Test Course Creation")
new_course = {
    "name": "测试课程",
    "instrument": "钢琴",
    "description": "这是一个测试课程",
    "teacher_name": "测试老师",
    "duration_minutes": 60,
    "price": 100.0,
    "max_students": 1,
    "is_active": 1
}
result = test_endpoint("/api/courses/", "POST", new_course)
if isinstance(result, dict) and "id" in result:
    print(f"   Course created successfully with ID: {result['id']}")
    course_id = result['id']
    
    print(f"\n8. Test Delete Course (ID: {course_id})")
    delete_result = test_endpoint(f"/api/courses/{course_id}", "DELETE")
    print(f"   Result: {delete_result}")
else:
    print(f"   Error: {result}")

print("\n" + "=" * 60)
print("All tests completed!")
print("=" * 60)
