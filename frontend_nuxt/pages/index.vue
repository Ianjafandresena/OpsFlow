<script setup>
// The app root always redirects to the employee login.
// Admin login is accessible only at /admin/login (typed manually in the URL).
definePageMeta({ layout: false })
await navigateTo('/login', { replace: true })
</script>
