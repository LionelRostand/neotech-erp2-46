
/**
 * Règles de sécurité Firebase pour l'application
 * Ces règles doivent être copiées et collées dans la console Firebase
 */

export const FIREBASE_RULES = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Fonctions d'aide pour les règles
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return isAuthenticated() && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    function hasPermission(module, action) {
      return isAuthenticated() && 
        get(/databases/$(database)/documents/userPermissions/$(request.auth.uid)).data[module][action] == true;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Règles pour les utilisateurs
    match /users/{userId} {
      allow read: if isAuthenticated() && (isOwner(userId) || isAdmin());
      allow create: if isAuthenticated();
      allow update: if isAuthenticated() && (isOwner(userId) || isAdmin());
      allow delete: if isAdmin();
    }
    
    // Règles pour les permissions utilisateur
    match /userPermissions/{userId} {
      allow read: if isAuthenticated() && (isOwner(userId) || isAdmin());
      allow write: if isAdmin();
    }
    
    // Règles pour les paramètres généraux
    match /settings/{document=**} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
    
    // Règles pour les modules installés
    match /modules/{document=**} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
    
    // Règles spécifiques pour le module Employés/RH
    match /employees/{document=**} {
      allow read: if isAuthenticated() && (hasPermission('employees', 'view') || isAdmin());
      allow create: if isAuthenticated() && (hasPermission('employees', 'create') || isAdmin());
      allow update: if isAuthenticated() && (hasPermission('employees', 'edit') || isAdmin());
      allow delete: if isAuthenticated() && (hasPermission('employees', 'delete') || isAdmin());
    }
    
    match /hr_departments/{document=**} {
      allow read: if isAuthenticated() && (hasPermission('employees', 'view') || isAdmin());
      allow create: if isAuthenticated() && (hasPermission('employees', 'create') || isAdmin());
      allow update: if isAuthenticated() && (hasPermission('employees', 'edit') || isAdmin());
      allow delete: if isAuthenticated() && (hasPermission('employees', 'delete') || isAdmin());
    }
    
    match /hr_payslips/{document=**} {
      allow read: if isAuthenticated() && (hasPermission('employees', 'view') || isAdmin());
      allow create: if isAuthenticated() && (hasPermission('employees', 'create') || isAdmin());
      allow update: if isAuthenticated() && (hasPermission('employees', 'edit') || isAdmin());
      allow delete: if isAuthenticated() && (hasPermission('employees', 'delete') || isAdmin());
    }
    
    match /hr_leave_requests/{document=**} {
      allow read: if isAuthenticated() && (hasPermission('employees', 'view') || isAdmin());
      allow create: if isAuthenticated() && (hasPermission('employees', 'create') || isAdmin() || isOwner(resource.data.employeeId));
      allow update: if isAuthenticated() && (hasPermission('employees', 'edit') || isAdmin() || isOwner(resource.data.employeeId));
      allow delete: if isAuthenticated() && (hasPermission('employees', 'delete') || isAdmin());
    }
    
    match /hr_contracts/{document=**} {
      allow read: if isAuthenticated() && (hasPermission('employees', 'view') || isAdmin() || isOwner(resource.data.employeeId));
      allow create: if isAuthenticated() && (hasPermission('employees', 'create') || isAdmin());
      allow update: if isAuthenticated() && (hasPermission('employees', 'edit') || isAdmin());
      allow delete: if isAuthenticated() && (hasPermission('employees', 'delete') || isAdmin());
    }
    
    match /hr_evaluations/{document=**} {
      allow read: if isAuthenticated() && (hasPermission('employees', 'view') || isAdmin() || isOwner(resource.data.employeeId));
      allow create: if isAuthenticated() && (hasPermission('employees', 'create') || isAdmin());
      allow update: if isAuthenticated() && (hasPermission('employees', 'edit') || isAdmin());
      allow delete: if isAuthenticated() && (hasPermission('employees', 'delete') || isAdmin());
    }
    
    match /hr_trainings/{document=**} {
      allow read: if isAuthenticated() && (hasPermission('employees', 'view') || isAdmin());
      allow create: if isAuthenticated() && (hasPermission('employees', 'create') || isAdmin());
      allow update: if isAuthenticated() && (hasPermission('employees', 'edit') || isAdmin());
      allow delete: if isAuthenticated() && (hasPermission('employees', 'delete') || isAdmin());
    }
    
    // Règles pour les entreprises (utilisées dans le module Employés)
    match /companies/{document=**} {
      allow read: if isAuthenticated() && (hasPermission('companies', 'read') || isAdmin());
      allow write: if isAuthenticated() && (hasPermission('companies', 'write') || isAdmin());
    }
    
    match /accounting/{document=**} {
      allow read: if isAuthenticated() && (hasPermission('accounting', 'read') || isAdmin());
      allow write: if isAuthenticated() && (hasPermission('accounting', 'write') || isAdmin());
    }
    
    match /projects/{document=**} {
      allow read: if isAuthenticated() && (hasPermission('projects', 'read') || isAdmin());
      allow write: if isAuthenticated() && (hasPermission('projects', 'write') || isAdmin());
    }
    
    match /crm/{document=**} {
      allow read: if isAuthenticated() && (hasPermission('crm', 'read') || isAdmin());
      allow write: if isAuthenticated() && (hasPermission('crm', 'write') || isAdmin());
    }
    
    // Services spécialisés
    match /restaurants/{document=**} {
      allow read: if isAuthenticated() && (hasPermission('restaurants', 'read') || isAdmin());
      allow write: if isAuthenticated() && (hasPermission('restaurants', 'write') || isAdmin());
    }
    
    match /garages/{document=**} {
      allow read: if isAuthenticated() && (hasPermission('garages', 'read') || isAdmin());
      allow write: if isAuthenticated() && (hasPermission('garages', 'write') || isAdmin());
    }
    
    match /transport/{document=**} {
      allow read: if isAuthenticated() && (hasPermission('transport', 'read') || isAdmin());
      allow write: if isAuthenticated() && (hasPermission('transport', 'write') || isAdmin());
    }
    
    // Règles pour le module Health
    match /health/{document=**} {
      allow read: if isAuthenticated() && (hasPermission('health', 'read') || isAdmin());
      allow write: if isAuthenticated() && (hasPermission('health', 'write') || isAdmin());
    }
    
    match /health_patients/{document=**} {
      allow read: if isAuthenticated() && (hasPermission('health', 'read') || isAdmin());
      allow write: if isAuthenticated() && (hasPermission('health', 'write') || isAdmin());
    }
    
    match /health_doctors/{document=**} {
      allow read: if isAuthenticated() && (hasPermission('health', 'read') || isAdmin());
      allow write: if isAuthenticated() && (hasPermission('health', 'write') || isAdmin());
    }
    
    match /health_nurses/{document=**} {
      allow read: if isAuthenticated() && (hasPermission('health', 'read') || isAdmin());
      allow write: if isAuthenticated() && (hasPermission('health', 'write') || isAdmin());
    }
    
    match /health_appointments/{document=**} {
      allow read: if isAuthenticated() && (hasPermission('health', 'read') || isAdmin());
      allow write: if isAuthenticated() && (hasPermission('health', 'write') || isAdmin());
    }
    
    match /health_consultations/{document=**} {
      allow read: if isAuthenticated() && (hasPermission('health', 'read') || isAdmin());
      allow create: if isAuthenticated() && (hasPermission('health', 'write') || isAdmin());
      allow update: if isAuthenticated() && (hasPermission('health', 'write') || isAdmin());
      allow delete: if isAuthenticated() && (hasPermission('health', 'delete') || isAdmin());
    }
    
    match /health_medical_records/{document=**} {
      allow read: if isAuthenticated() && (hasPermission('health', 'read_medical_records') || isAdmin());
      allow create: if isAuthenticated() && (hasPermission('health', 'write_medical_records') || isAdmin());
      allow update: if isAuthenticated() && (hasPermission('health', 'write_medical_records') || isAdmin());
      allow delete: if isAuthenticated() && (hasPermission('health', 'delete_medical_records') || isAdmin());
    }
    
    match /health_laboratory/{document=**} {
      allow read: if isAuthenticated() && (hasPermission('health', 'read_lab') || isAdmin());
      allow create: if isAuthenticated() && (hasPermission('health', 'write_lab') || isAdmin());
      allow update: if isAuthenticated() && (hasPermission('health', 'write_lab') || isAdmin());
      allow delete: if isAuthenticated() && (hasPermission('health', 'delete_lab') || isAdmin());
    }
    
    match /health_prescriptions/{document=**} {
      allow read: if isAuthenticated() && (hasPermission('health', 'read_prescriptions') || isAdmin());
      allow create: if isAuthenticated() && (hasPermission('health', 'write_prescriptions') || isAdmin());
      allow update: if isAuthenticated() && (hasPermission('health', 'write_prescriptions') || isAdmin());
      allow delete: if isAuthenticated() && (hasPermission('health', 'delete_prescriptions') || isAdmin());
    }
    
    match /health_pharmacy/{document=**} {
      allow read: if isAuthenticated() && (hasPermission('health', 'read_pharmacy') || isAdmin());
      allow write: if isAuthenticated() && (hasPermission('health', 'write_pharmacy') || isAdmin());
    }
    
    match /health_staff/{document=**} {
      allow read: if isAuthenticated() && (hasPermission('health', 'read_staff') || isAdmin());
      allow create: if isAuthenticated() && (hasPermission('health', 'write_staff') || isAdmin());
      allow update: if isAuthenticated() && (hasPermission('health', 'write_staff') || isAdmin());
      allow delete: if isAuthenticated() && (hasPermission('health', 'delete_staff') || isAdmin());
    }
    
    match /health_schedules/{document=**} {
      allow read: if isAuthenticated() && (hasPermission('health', 'read_schedules') || isAdmin());
      allow write: if isAuthenticated() && (hasPermission('health', 'write_schedules') || isAdmin());
    }
    
    match /health_absences/{document=**} {
      allow read: if isAuthenticated() && (hasPermission('health', 'read_absences') || isAdmin());
      allow write: if isAuthenticated() && (hasPermission('health', 'write_absences') || isAdmin());
    }
    
    match /health_pharmacy_inventory/{document=**} {
      allow read: if isAuthenticated() && (hasPermission('health', 'read_pharmacy') || isAdmin());
      allow write: if isAuthenticated() && (hasPermission('health', 'write_pharmacy') || isAdmin());
    }
    
    match /health_pharmacy_sales/{document=**} {
      allow read: if isAuthenticated() && (hasPermission('health', 'read_pharmacy') || isAdmin());
      allow write: if isAuthenticated() && (hasPermission('health', 'write_pharmacy') || isAdmin());
    }
    
    match /health_pharmacy_restocks/{document=**} {
      allow read: if isAuthenticated() && (hasPermission('health', 'read_pharmacy') || isAdmin());
      allow write: if isAuthenticated() && (hasPermission('health', 'write_pharmacy') || isAdmin());
    }
    
    match /health_settings/{document=**} {
      allow read: if isAuthenticated() && (hasPermission('health', 'read') || isAdmin());
      allow write: if isAuthenticated() && (hasPermission('health', 'admin') || isAdmin());
    }
    
    match /vehicleRentals/{document=**} {
      allow read: if isAuthenticated() && (hasPermission('vehicleRentals', 'read') || isAdmin());
      allow write: if isAuthenticated() && (hasPermission('vehicleRentals', 'write') || isAdmin());
    }
    
    // Règles spécifiques pour le module Freight
    match /freight_shipments/{document=**} {
      allow read: if isAuthenticated() && (hasPermission('freight', 'read') || isAdmin());
      allow write: if isAuthenticated() && (hasPermission('freight', 'write') || isAdmin());
    }
    
    match /freight_containers/{document=**} {
      allow read: if isAuthenticated() && (hasPermission('freight', 'read') || isAdmin());
      allow write: if isAuthenticated() && (hasPermission('freight', 'write') || isAdmin());
    }
    
    match /freight_carriers/{document=**} {
      allow read: if isAuthenticated() && (hasPermission('freight', 'read') || isAdmin());
      allow write: if isAuthenticated() && (hasPermission('freight', 'write') || isAdmin());
    }
    
    match /freight_tracking/{document=**} {
      allow read: if true; // Accessible publiquement pour le suivi client
      allow write: if isAuthenticated() && (hasPermission('freight', 'write') || isAdmin());
    }
    
    match /freight_tracking_events/{document=**} {
      allow read: if true; // Accessible publiquement pour le suivi client
      allow write: if isAuthenticated() && (hasPermission('freight', 'write') || isAdmin());
    }
    
    match /freight_packages/{document=**} {
      allow read: if isAuthenticated() && (hasPermission('freight', 'read') || isAdmin());
      allow write: if isAuthenticated() && (hasPermission('freight', 'write') || isAdmin());
    }
    
    match /freight_routes/{document=**} {
      allow read: if isAuthenticated() && (hasPermission('freight', 'read') || isAdmin());
      allow write: if isAuthenticated() && (hasPermission('freight', 'write') || isAdmin());
    }
    
    match /freight_pricing/{document=**} {
      allow read: if isAuthenticated() && (hasPermission('freight', 'read') || isAdmin());
      allow write: if isAuthenticated() && (hasPermission('freight', 'write') || isAdmin());
    }
    
    match /freight_documents/{document=**} {
      allow read: if isAuthenticated() && (hasPermission('freight', 'read') || isAdmin());
      allow write: if isAuthenticated() && (hasPermission('freight', 'write') || isAdmin());
    }
    
    match /freight_package_types/{document=**} {
      allow read: if isAuthenticated() && (hasPermission('freight', 'read') || isAdmin());
      allow write: if isAuthenticated() && (hasPermission('freight', 'write') || isAdmin());
    }
    
    match /freight_client_portal/{document=**} {
      allow read: if true; // Accessible publiquement pour les clients
      allow write: if isAuthenticated() && (hasPermission('freight', 'write') || isAdmin());
    }
    
    match /library/{document=**} {
      allow read: if isAuthenticated() && (hasPermission('library', 'read') || isAdmin());
      allow write: if isAuthenticated() && (hasPermission('library', 'write') || isAdmin());
    }
    
    // Présence numérique
    match /websites/{document=**} {
      allow read: if isAuthenticated() && (hasPermission('websites', 'read') || isAdmin());
      allow write: if isAuthenticated() && (hasPermission('websites', 'write') || isAdmin());
    }
    
    match /ecommerce/{document=**} {
      allow read: if isAuthenticated() && (hasPermission('ecommerce', 'read') || isAdmin());
      allow write: if isAuthenticated() && (hasPermission('ecommerce', 'write') || isAdmin());
    }
    
    match /academy/{document=**} {
      allow read: if isAuthenticated() && (hasPermission('academy', 'read') || isAdmin());
      allow write: if isAuthenticated() && (hasPermission('academy', 'write') || isAdmin());
    }
    
    match /events/{document=**} {
      allow read: if isAuthenticated() && (hasPermission('events', 'read') || isAdmin());
      allow write: if isAuthenticated() && (hasPermission('events', 'write') || isAdmin());
    }
    
    // Communication
    match /messages/{document=**} {
      allow read: if isAuthenticated() && 
        (hasPermission('messages', 'read') || isAdmin() || 
        resource.data.senderId == request.auth.uid || 
        resource.data.recipientId == request.auth.uid);
      allow create: if isAuthenticated() && (hasPermission('messages', 'create') || isAdmin());
      allow update: if isAuthenticated() && 
        (hasPermission('messages', 'update') || isAdmin() || 
        resource.data.senderId == request.auth.uid);
      allow delete: if isAuthenticated() && (hasPermission('messages', 'delete') || isAdmin());
    }
    
    match /documents/{document=**} {
      allow read: if isAuthenticated() && 
        (hasPermission('documents', 'read') || isAdmin() || 
        resource.data.ownerId == request.auth.uid || 
        resource.data.sharedWith[request.auth.uid] == true);
      allow write: if isAuthenticated() && 
        (hasPermission('documents', 'write') || isAdmin() || 
        resource.data.ownerId == request.auth.uid);
    }
  }
}
`;
