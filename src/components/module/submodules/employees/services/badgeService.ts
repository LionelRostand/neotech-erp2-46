
import { addDocument } from '@/hooks/firestore/create-operations';
import { getAllDocuments } from '@/hooks/firestore/read-operations';
import { updateDocument } from '@/hooks/firestore/update-operations';
import { deleteDocument } from '@/hooks/firestore/delete-operations';
import { toast } from 'sonner';
import { BadgeData } from '../badges/BadgeTypes';

// Collection où sont stockés les badges
const BADGES_COLLECTION = 'employee_badges';

/**
 * Récupère tous les badges employés depuis Firestore
 */
export const getBadges = async (): Promise<BadgeData[]> => {
  try {
    const badges = await getAllDocuments(BADGES_COLLECTION);
    return badges as BadgeData[];
  } catch (error) {
    console.error("Erreur lors de la récupération des badges:", error);
    toast.error("Échec du chargement des badges");
    return [];
  }
};

/**
 * Ajoute un nouveau badge dans Firestore
 */
export const addBadge = async (badgeData: Omit<BadgeData, 'id'>): Promise<BadgeData | null> => {
  try {
    const newBadge = await addDocument(BADGES_COLLECTION, badgeData);
    toast.success("Badge créé avec succès");
    return newBadge as BadgeData;
  } catch (error) {
    console.error("Erreur lors de la création du badge:", error);
    toast.error("Échec de la création du badge");
    return null;
  }
};

/**
 * Met à jour un badge existant dans Firestore
 */
export const updateBadge = async (id: string, badgeData: Partial<BadgeData>): Promise<BadgeData | null> => {
  try {
    const updatedBadge = await updateDocument(BADGES_COLLECTION, id, badgeData);
    toast.success("Badge mis à jour avec succès");
    return updatedBadge as BadgeData;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du badge:", error);
    toast.error("Échec de la mise à jour du badge");
    return null;
  }
};

/**
 * Supprime un badge de Firestore
 */
export const deleteBadge = async (id: string): Promise<boolean> => {
  try {
    await deleteDocument(BADGES_COLLECTION, id);
    toast.success("Badge supprimé avec succès");
    return true;
  } catch (error) {
    console.error("Erreur lors de la suppression du badge:", error);
    toast.error("Échec de la suppression du badge");
    return false;
  }
};

/**
 * Récupère les badges d'un employé spécifique
 */
export const getEmployeeBadges = async (employeeId: string): Promise<BadgeData[]> => {
  try {
    const allBadges = await getBadges();
    return allBadges.filter(badge => badge.employeeId === employeeId);
  } catch (error) {
    console.error(`Erreur lors de la récupération des badges pour l'employé ${employeeId}:`, error);
    toast.error("Échec du chargement des badges de l'employé");
    return [];
  }
};
