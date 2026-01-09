"""Comprehensive integration test for the backend API."""

import asyncio
import aiohttp
import sys
sys.path.insert(0, ".")

from jose import jwt

# Test configuration
BASE_URL = "http://localhost:8000"
SECRET = "d7a9ed6f731c1a05926598e546cc3759c8d16a5543850c7ebb19b37c0ab077a8"

def generate_token(user_id: str) -> str:
    return jwt.encode({"sub": user_id, "exp": 9999999999}, SECRET, algorithm="HS256")

async def test_endpoint(session: aiohttp.ClientSession, method: str, path: str, token: str = None, data: dict = None, expected_status: int = None):
    """Make a request and return the result."""
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"

    kwargs = {"headers": headers}
    if data:
        kwargs["json"] = data

    async with session.request(method, f"{BASE_URL}{path}", **kwargs) as response:
        text = await response.text()
        try:
            json_data = aiohttp.ClientResponse.json(response, status) if text else None
        except:
            json_data = None
        return {
            "status": response.status,
            "body": json_data,
            "text": text,
            "success": expected_status is None or response.status == expected_status
        }

async def run_tests():
    """Run all integration tests."""
    results = []

    async with aiohttp.ClientSession() as session:
        # Test 1: Health check
        result = await test_endpoint(session, "GET", "/health", expected_status=200)
        results.append(("Health check", result))
        print(f"[{'PASS' if result['success'] else 'FAIL'}] Health check: {result['status']}")

        # Test 2: No auth - should return 401
        result = await test_endpoint(session, "GET", "/api/tasks", expected_status=401)
        results.append(("No auth - 401", result))
        print(f"[{'PASS' if result['success'] else 'FAIL'}] No auth returns 401: {result['status']} - {result['text'][:50]}")

        # Test 3: Invalid token - should return 401
        result = await test_endpoint(session, "GET", "/api/tasks", token="invalid-token", expected_status=401)
        results.append(("Invalid token - 401", result))
        print(f"[{'PASS' if result['success'] else 'FAIL'}] Invalid token returns 401: {result['status']} - {result['text'][:50]}")

        user_a = "test-user-a"
        user_b = "test-user-b"
        token_a = generate_token(user_a)
        token_b = generate_token(user_b)

        # Test 4: Create task as User A
        result = await test_endpoint(session, "POST", "/api/tasks", token=token_a,
                                     data={"title": "User A's task", "description": "Created by user A"})
        results.append(("Create task as User A", result))
        print(f"[{'PASS' if result['success'] else 'FAIL'}] Create task: {result['status']}")
        task_id = result["body"]["id"] if result["body"] else None

        # Test 5: List tasks for User A
        result = await test_endpoint(session, "GET", "/api/tasks", token=token_a, expected_status=200)
        results.append(("List User A tasks", result))
        print(f"[{'PASS' if result['success'] else 'FAIL'}] List tasks: {result['status']}, count: {len(result['body']) if result['body'] else 0}")

        # Test 6: User B cannot see User A's task (user isolation)
        if task_id:
            result = await test_endpoint(session, "GET", f"/api/tasks/{task_id}", token=token_b, expected_status=404)
            results.append(("User isolation - get", result))
            print(f"[{'PASS' if result['success'] else 'FAIL'}] User B cannot access User A task (404): {result['status']} - {result['text'][:50]}")

        # Test 7: User B cannot update User A's task
        if task_id:
            result = await test_endpoint(session, "PUT", f"/api/tasks/{task_id}", token=token_b,
                                        data={"title": "Hacked!"}, expected_status=404)
            results.append(("User isolation - update", result))
            print(f"[{'PASS' if result['success'] else 'FAIL'}] User B cannot update User A task (404): {result['status']}")

        # Test 8: User B cannot delete User A's task
        if task_id:
            result = await test_endpoint(session, "DELETE", f"/api/tasks/{task_id}", token=token_b, expected_status=404)
            results.append(("User isolation - delete", result))
            print(f"[{'PASS' if result['success'] else 'FAIL'}] User B cannot delete User A task (404): {result['status']}")

        # Test 9: Validation - empty title
        result = await test_endpoint(session, "POST", "/api/tasks", token=token_a, data={"title": ""}, expected_status=422)
        results.append(("Validation - empty title", result))
        print(f"[{'PASS' if result['success'] else 'FAIL'}] Empty title returns 422: {result['status']}")

        # Test 10: Validation - title too long
        result = await test_endpoint(session, "POST", "/api/tasks", token=token_a,
                                     data={"title": "x" * 101}, expected_status=422)
        results.append(("Validation - title too long", result))
        print(f"[{'PASS' if result['success'] else 'FAIL'}] Title > 100 chars returns 422: {result['status']}")

        # Test 11: Toggle completion
        if task_id:
            result = await test_endpoint(session, "PATCH", f"/api/tasks/{task_id}/complete", token=token_a, expected_status=200)
            results.append(("Toggle completion", result))
            completed = result["body"]["completed"] if result["body"] else False
            print(f"[{'PASS' if completed else 'FAIL'}] Toggle completion: completed={completed}")

        # Test 12: Delete task as User A
        if task_id:
            result = await test_endpoint(session, "DELETE", f"/api/tasks/{task_id}", token=token_a, expected_status=204)
            results.append(("Delete task", result))
            print(f"[{'PASS' if result['success'] else 'FAIL'}] Delete task: {result['status']}")

        # Test 13: Deleted task returns 404
        if task_id:
            result = await test_endpoint(session, "GET", f"/api/tasks/{task_id}", token=token_a, expected_status=404)
            results.append(("Deleted task returns 404", result))
            print(f"[{'PASS' if result['success'] else 'FAIL'}] Deleted task returns 404: {result['status']}")

    # Summary
    passed = sum(1 for _, r in results if r["success"])
    total = len(results)
    print(f"\n{'='*50}")
    print(f"Tests: {passed}/{total} passed")
    print(f"{'='*50}")

    return all(r["success"] for _, r in results)

if __name__ == "__main__":
    success = asyncio.run(run_tests())
    sys.exit(0 if success else 1)
