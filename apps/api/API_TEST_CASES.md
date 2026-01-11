# CMS API Test Cases

## Variables Setup
```
baseUrl: http://localhost:3002/api
authToken: (JWT dari Supabase login)
```

---

## 1. Health Module

### ✅ Positive Tests

| Test Case | Method | Endpoint | Expected |
|-----------|--------|----------|----------|
| Health check works | GET | `/health` | 200, `{ status: "ok" }` |
| DB health check works | GET | `/health/db` | 200, `{ status: "ok", database: "connected" }` |

### ❌ Negative Tests
- N/A (these endpoints always succeed if server is up)

---

## 2. Messages Module

### ✅ Positive Tests

| Test Case | Method | Endpoint | Body | Expected |
|-----------|--------|----------|------|----------|
| Submit contact form | POST | `/messages` | `{ "name": "John", "email": "john@test.com", "content": "Hello" }` | 201, returns message object |
| Get all messages (auth) | GET | `/messages` | - | 200, array of messages |
| Get single message (auth) | GET | `/messages/:id` | - | 200, message object |
| Toggle read status (auth) | PATCH | `/messages/:id/read` | - | 200, updated message |
| Delete message (auth) | DELETE | `/messages/:id` | - | 200, `{ success: true }` |

### ❌ Negative Tests

| Test Case | Method | Endpoint | Body | Expected |
|-----------|--------|----------|------|----------|
| Missing name | POST | `/messages` | `{ "email": "test@test.com", "content": "Hello" }` | 400, validation error |
| Missing email | POST | `/messages` | `{ "name": "John", "content": "Hello" }` | 400, validation error |
| Invalid email format | POST | `/messages` | `{ "name": "John", "email": "invalid", "content": "Hello" }` | 400, validation error |
| Missing content | POST | `/messages` | `{ "name": "John", "email": "test@test.com" }` | 400, validation error |
| Get messages without auth | GET | `/messages` | - | 401, Unauthorized |
| Get non-existent message | GET | `/messages/invalid-uuid` | - | 404, Not Found |
| Delete without auth | DELETE | `/messages/:id` | - | 401, Unauthorized |

---

## 3. Profile Module

### ✅ Positive Tests

| Test Case | Method | Endpoint | Body | Expected |
|-----------|--------|----------|------|----------|
| Get profile (public) | GET | `/profile` | - | 200, profile or null |
| Update profile (auth) | PUT | `/profile` | `{ "fullName": "Test", "title": "Designer" }` | 200, updated profile |
| Get educations (public) | GET | `/profile/educations` | - | 200, array |
| Create education (auth) | POST | `/profile/educations` | `{ "schoolName": "UI", "startDate": "2020-01-01" }` | 201, education object |
| Update education (auth) | PUT | `/profile/educations/:id` | `{ "degree": "S1" }` | 200, updated education |
| Delete education (auth) | DELETE | `/profile/educations/:id` | - | 200, `{ success: true }` |

### ❌ Negative Tests

| Test Case | Method | Endpoint | Body | Expected |
|-----------|--------|----------|------|----------|
| Update profile without auth | PUT | `/profile` | `{ "fullName": "Test" }` | 401, Unauthorized |
| Create education without auth | POST | `/profile/educations` | `{ "schoolName": "Test", "startDate": "2020-01-01" }` | 401, Unauthorized |
| Create education missing schoolName | POST | `/profile/educations` | `{ "startDate": "2020-01-01" }` | 400, validation error |
| Create education invalid date | POST | `/profile/educations` | `{ "schoolName": "Test", "startDate": "invalid" }` | 400, validation error |
| Delete non-existent education | DELETE | `/profile/educations/invalid-uuid` | - | 404, Not Found |

---

## 4. Categories Module

### ✅ Positive Tests

| Test Case | Method | Endpoint | Body | Expected |
|-----------|--------|----------|------|----------|
| Get all categories (public) | GET | `/categories` | - | 200, array with project count |
| Create category (auth) | POST | `/categories` | `{ "name": "Branding" }` | 201, category with slug |
| Update category (auth) | PUT | `/categories/:id` | `{ "name": "Brand Identity" }` | 200, updated category |
| Reorder categories (auth) | PATCH | `/categories/reorder` | `{ "items": [{ "id": "..." }] }` | 200, `{ success: true }` |
| Delete category (auth) | DELETE | `/categories/:id` | - | 200, `{ success: true }` |

### ❌ Negative Tests

| Test Case | Method | Endpoint | Body | Expected |
|-----------|--------|----------|------|----------|
| Create without auth | POST | `/categories` | `{ "name": "Test" }` | 401, Unauthorized |
| Create missing name | POST | `/categories` | `{}` | 400, validation error |
| Create duplicate name | POST | `/categories` | `{ "name": "ExistingName" }` | 409, Conflict |
| Delete category with projects | DELETE | `/categories/:id` | - | 409, Conflict |
| Delete non-existent | DELETE | `/categories/invalid-uuid` | - | 404, Not Found |

---

## 5. Projects Module

### ✅ Positive Tests

| Test Case | Method | Endpoint | Body | Expected |
|-----------|--------|----------|------|----------|
| Get all projects (public) | GET | `/projects` | - | 200, array with relations |
| Get visible projects (public) | GET | `/projects/visible` | - | 200, only isVisible=true |
| Get project by ID (public) | GET | `/projects/:id` | - | 200, project with relations |
| Get project by slug (public) | GET | `/projects/slug/:slug` | - | 200, project object |
| Like project (public) | POST | `/projects/:id/like` | - | 200, updated like count |
| Create project (auth) | POST | `/projects` | See below | 201, project with slug |
| Update project (auth) | PUT | `/projects/:id` | `{ "title": "Updated" }` | 200, updated project |
| Toggle visibility (auth) | PATCH | `/projects/:id/visibility` | - | 200, toggled isVisible |
| Reorder projects (auth) | PATCH | `/projects/reorder` | `{ "items": [...] }` | 200, `{ success: true }` |
| Delete project (auth) | DELETE | `/projects/:id` | - | 200, `{ success: true }` |

**Create Project Body:**
```json
{
  "title": "New Project",
  "projectDate": "2024-01-15",
  "summary": "Project summary",
  "thumbnailUrl": "https://example.com/thumb.jpg"
}
```

### ❌ Negative Tests

| Test Case | Method | Endpoint | Body | Expected |
|-----------|--------|----------|------|----------|
| Create without auth | POST | `/projects` | `{...}` | 401, Unauthorized |
| Create missing title | POST | `/projects` | `{ "summary": "..." }` | 400, validation error |
| Create missing projectDate | POST | `/projects` | `{ "title": "..." }` | 400, validation error |
| Create invalid date | POST | `/projects` | `{ "title": "...", "projectDate": "invalid" }` | 400, validation error |
| Get non-existent by ID | GET | `/projects/invalid-uuid` | - | 404, Not Found |
| Get non-existent by slug | GET | `/projects/slug/not-exist` | - | 404, Not Found |
| Like same project twice (same IP) | POST | `/projects/:id/like` | - | 409, Conflict |
| Delete without auth | DELETE | `/projects/:id` | - | 401, Unauthorized |

### 📸 Gallery Management

#### ✅ Positive Tests

| Test Case | Method | Endpoint | Body | Expected |
|-----------|--------|----------|------|----------|
| Add gallery image (auth) | POST | `/projects/:id/gallery` | `{ "url": "https://..." }` | 201, ProjectImage object |
| Add multiple images sequentially | POST | `/projects/:id/gallery` | `{ "url": "..." }` x N | 201 each, gallery grows |
| Remove single gallery image | DELETE | `/projects/:id/gallery` | `{ "imageIds": ["uuid"] }` | 200, `{ success: true }` |
| Remove multiple gallery images | DELETE | `/projects/:id/gallery` | `{ "imageIds": ["uuid1", "uuid2"] }` | 200, `{ success: true }` |
| Gallery included in project response | GET | `/projects/:id` | - | 200, `gallery: [...]` array |

**Add Gallery Image Body:**
```json
{
  "url": "https://example.com/gallery-image.jpg"
}
```

**Remove Gallery Images Body:**
```json
{
  "imageIds": [
    "gallery-image-uuid-1",
    "gallery-image-uuid-2"
  ]
}
```

#### ❌ Negative Tests

| Test Case | Method | Endpoint | Body | Expected |
|-----------|--------|----------|------|----------|
| Add gallery without auth | POST | `/projects/:id/gallery` | `{ "url": "..." }` | 401, Unauthorized |
| Add gallery missing url | POST | `/projects/:id/gallery` | `{}` | 400, validation error |
| Add gallery to non-existent project | POST | `/projects/invalid-uuid/gallery` | `{ "url": "..." }` | 404, Not Found |
| Remove without auth | DELETE | `/projects/:id/gallery` | `{ "imageIds": [...] }` | 401, Unauthorized |
| Remove with invalid UUID format | DELETE | `/projects/:id/gallery` | `{ "imageIds": ["not-uuid"] }` | 400, validation error |
| Remove from non-existent project | DELETE | `/projects/invalid-uuid/gallery` | `{ "imageIds": [...] }` | 404, Not Found |

---

## 6. Skills Module

### ✅ Positive Tests

| Test Case | Method | Endpoint | Body | Expected |
|-----------|--------|----------|------|----------|
| Get all skills (public) | GET | `/skills` | - | 200, array |
| Get hard skills only (public) | GET | `/skills?category=HARD_SKILL` | - | 200, filtered array |
| Get soft skills only (public) | GET | `/skills?category=SOFT_SKILL` | - | 200, filtered array |
| Create skill (auth) | POST | `/skills` | `{ "name": "Photoshop", "category": "HARD_SKILL" }` | 201, skill object |
| Update skill (auth) | PUT | `/skills/:id` | `{ "name": "Adobe Photoshop" }` | 200, updated skill |
| Reorder skills (auth) | PATCH | `/skills/reorder` | `{ "items": [...] }` | 200, `{ success: true }` |
| Delete skill (auth) | DELETE | `/skills/:id` | - | 200, `{ success: true }` |

### ❌ Negative Tests

| Test Case | Method | Endpoint | Body | Expected |
|-----------|--------|----------|------|----------|
| Create without auth | POST | `/skills` | `{...}` | 401, Unauthorized |
| Create missing name | POST | `/skills` | `{ "category": "HARD_SKILL" }` | 400, validation error |
| Create invalid category | POST | `/skills` | `{ "name": "Test", "category": "INVALID" }` | 400, validation error |
| Delete non-existent | DELETE | `/skills/invalid-uuid` | - | 404, Not Found |

---

## 7. Experiences Module

### ✅ Positive Tests

| Test Case | Method | Endpoint | Body | Expected |
|-----------|--------|----------|------|----------|
| Get all experiences (public) | GET | `/experiences` | - | 200, ordered array |
| Get experience by ID (public) | GET | `/experiences/:id` | - | 200, experience object |
| Create experience (auth) | POST | `/experiences` | See below | 201, experience object |
| Update experience (auth) | PUT | `/experiences/:id` | `{ "role": "Lead Designer" }` | 200, updated |
| Reorder experiences (auth) | PATCH | `/experiences/reorder` | `{ "items": [...] }` | 200, `{ success: true }` |
| Delete experience (auth) | DELETE | `/experiences/:id` | - | 200, `{ success: true }` |

**Create Experience Body:**
```json
{
  "company": "Creative Agency",
  "role": "Designer",
  "startDate": "2022-01-01",
  "isCurrent": true,
  "description": { "points": ["Task 1", "Task 2"] }
}
```

### ❌ Negative Tests

| Test Case | Method | Endpoint | Body | Expected |
|-----------|--------|----------|------|----------|
| Create without auth | POST | `/experiences` | `{...}` | 401, Unauthorized |
| Create missing company | POST | `/experiences` | `{ "role": "..." }` | 400, validation error |
| Create missing role | POST | `/experiences` | `{ "company": "..." }` | 400, validation error |
| Get non-existent | GET | `/experiences/invalid-uuid` | - | 404, Not Found |

---

## 8. Services Module

### ✅ Positive Tests

| Test Case | Method | Endpoint | Body | Expected |
|-----------|--------|----------|------|----------|
| Get all services (public) | GET | `/services` | - | 200, ordered array |
| Create service (auth) | POST | `/services` | `{ "title": "Branding", "description": "..." }` | 201 |
| Update service (auth) | PUT | `/services/:id` | `{ "title": "Updated" }` | 200 |
| Reorder services (auth) | PATCH | `/services/reorder` | `{ "items": [...] }` | 200 |
| Delete service (auth) | DELETE | `/services/:id` | - | 200 |

### ❌ Negative Tests

| Test Case | Method | Endpoint | Body | Expected |
|-----------|--------|----------|------|----------|
| Create without auth | POST | `/services` | `{...}` | 401, Unauthorized |
| Create missing title | POST | `/services` | `{ "description": "..." }` | 400, validation error |
| Create missing description | POST | `/services` | `{ "title": "..." }` | 400, validation error |
| Delete non-existent | DELETE | `/services/invalid-uuid` | - | 404, Not Found |

---

## 9. Hero Slides Module

### ✅ Positive Tests

| Test Case | Method | Endpoint | Body | Expected |
|-----------|--------|----------|------|----------|
| Get all slides (public) | GET | `/hero-slides` | - | 200, all slides |
| Get visible slides (public) | GET | `/hero-slides/visible` | - | 200, only visible |
| Create slide (auth) | POST | `/hero-slides` | See below | 201 |
| Update slide (auth) | PUT | `/hero-slides/:id` | `{ "title": "Updated" }` | 200 |
| Toggle visibility (auth) | PATCH | `/hero-slides/:id/visibility` | - | 200 |
| Reorder slides (auth) | PATCH | `/hero-slides/reorder` | `{ "items": [...] }` | 200 |
| Delete slide (auth) | DELETE | `/hero-slides/:id` | - | 200 |

**Create Slide Body:**
```json
{
  "title": "Welcome",
  "leftTitle": "Creative",
  "leftSubtitle": "Solutions",
  "rightTitle": "Professional",
  "rightSubtitle": "Design",
  "isVisible": true
}
```

### ❌ Negative Tests

| Test Case | Method | Endpoint | Body | Expected |
|-----------|--------|----------|------|----------|
| Create without auth | POST | `/hero-slides` | `{...}` | 401, Unauthorized |
| Create missing title | POST | `/hero-slides` | `{ "leftTitle": "..." }` | 400, validation error |
| Toggle non-existent | PATCH | `/hero-slides/invalid/visibility` | - | 404, Not Found |

---

## 10. Settings Module

### ✅ Positive Tests

| Test Case | Method | Endpoint | Body | Expected |
|-----------|--------|----------|------|----------|
| Get settings (public) | GET | `/settings` | - | 200, settings or defaults |
| Update settings (auth) | PUT | `/settings` | `{ "siteName": "My Portfolio" }` | 200 |

### ❌ Negative Tests

| Test Case | Method | Endpoint | Body | Expected |
|-----------|--------|----------|------|----------|
| Update without auth | PUT | `/settings` | `{...}` | 401, Unauthorized |

---

## 11. Upload Module

### ✅ Positive Tests

| Test Case | Method | Endpoint | Body | Expected |
|-----------|--------|----------|------|----------|
| Upload image (auth) | POST | `/upload/image` | form-data: file | 200, `{ key, url }` |
| Upload multiple (auth) | POST | `/upload/images` | form-data: files | 200, `{ files: [...] }` |
| Delete file (auth) | DELETE | `/upload/:key` | - | 200, `{ success: true }` |

### ❌ Negative Tests

| Test Case | Method | Endpoint | Body | Expected |
|-----------|--------|----------|------|----------|
| Upload without auth | POST | `/upload/image` | file | 401, Unauthorized |
| Upload no file | POST | `/upload/image` | empty | 400, No file uploaded |
| Upload invalid type | POST | `/upload/image` | .exe file | 400, Invalid file type |
| Upload too large | POST | `/upload/image` | >10MB file | 400, File too large |
| Delete without auth | DELETE | `/upload/test.jpg` | - | 401, Unauthorized |

---

## 11. Hero Slides Module

### ✅ Positive Tests

| Test Case | Method | Endpoint | Body | Expected |
|-----------|--------|----------|------|----------|
| Get all slides (public) | GET | `/hero-slides` | - | 200, array of slides |
| Get visible slides (public) | GET | `/hero-slides/visible` | - | 200, array of visible slides |
| Create slide (auth) | POST | `/hero-slides` | `{ "title": "Test", "leftTitle": "LT", "leftSubtitle": "LS", "rightTitle": "RT", "rightSubtitle": "RS" }` | 201, slide object |
| Update slide (auth) | PUT | `/hero-slides/:id` | `{ "title": "Updated" }` | 200, updated slide |
| Toggle visibility (auth) | PATCH | `/hero-slides/:id/visibility` | - | 200, updated slide |
| Reorder slides (auth) | PATCH | `/hero-slides/reorder` | `{ "items": [{ "id": "..." }] }` | 200, `{ success: true }` |
| Delete slide (auth) | DELETE | `/hero-slides/:id` | - | 200, `{ success: true }` |

### ❌ Negative Tests

| Test Case | Method | Endpoint | Body | Expected |
|-----------|--------|----------|------|----------|
| Create without auth | POST | `/hero-slides` | `{ ... }` | 401, Unauthorized |
| Create missing title | POST | `/hero-slides` | `{ "leftTitle": "LT" }` | 400, validation error |
| Toggle last visible slide | PATCH | `/hero-slides/:id/visibility` | - | 400, "Minimal satu slide harus tetap visible" |
| Update non-existent | PUT | `/hero-slides/invalid-uuid` | `{ "title": "Test" }` | 404, Not Found |
| Delete non-existent | DELETE | `/hero-slides/invalid-uuid` | - | 404, Not Found |

---

## Rate Limiting Tests

| Test Case | Expected |
|-----------|----------|
| 100+ requests in 1 minute to any endpoint | 429, Too Many Requests |
| Spam contact form (>5 in 1 min) | 429, Too Many Requests |
