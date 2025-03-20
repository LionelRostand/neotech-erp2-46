
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Book } from '../BooksPage';
import { PlusCircle, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BookFormProps {
  book?: Book;
  onSubmit: (book: Book) => void;
  onCancel: () => void;
}

// List of genres for the select input
const genres = [
  "Roman", "Poésie", "Théâtre", "Essai", "Biographie",
  "Science-Fiction", "Fantastique", "Policier", "Jeunesse",
  "Histoire", "Philosophie", "Science", "Art", "Cuisine",
  "Voyage", "Sport", "Économie", "Politique", "Religion",
  "Bande Dessinée", "Manga", "Conte", "Autre"
];

const BookForm: React.FC<BookFormProps> = ({ book, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Book>(book || {
    title: '',
    author: '',
    isbn: '',
    publishYear: new Date().getFullYear(),
    publisher: '',
    genre: '',
    summary: '',
    tags: [],
    availableCopies: 1,
    totalCopies: 1,
    isEbook: false,
    fileFormats: []
  });
  
  const [tagInput, setTagInput] = useState('');
  const [formatInput, setFormatInput] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    // Convert numeric fields
    if (name === 'publishYear' || name === 'availableCopies' || name === 'totalCopies') {
      setFormData({
        ...formData,
        [name]: parseInt(value, 10) || 0
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData({
      ...formData,
      isEbook: checked
    });
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag)
    });
  };

  const handleAddFormat = () => {
    if (
      formatInput.trim() && 
      formData.fileFormats && 
      !formData.fileFormats.includes(formatInput.trim())
    ) {
      setFormData({
        ...formData,
        fileFormats: [...(formData.fileFormats || []), formatInput.trim()]
      });
      setFormatInput('');
    }
  };

  const handleRemoveFormat = (format: string) => {
    setFormData({
      ...formData,
      fileFormats: formData.fileFormats?.filter(f => f !== format)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Titre</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        {/* Author */}
        <div className="space-y-2">
          <Label htmlFor="author">Auteur</Label>
          <Input
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
          />
        </div>

        {/* ISBN */}
        <div className="space-y-2">
          <Label htmlFor="isbn">ISBN</Label>
          <Input
            id="isbn"
            name="isbn"
            value={formData.isbn}
            onChange={handleChange}
            required
          />
        </div>

        {/* Publication Year */}
        <div className="space-y-2">
          <Label htmlFor="publishYear">Année de publication</Label>
          <Input
            id="publishYear"
            name="publishYear"
            type="number"
            value={formData.publishYear}
            onChange={handleChange}
            required
          />
        </div>

        {/* Publisher */}
        <div className="space-y-2">
          <Label htmlFor="publisher">Éditeur</Label>
          <Input
            id="publisher"
            name="publisher"
            value={formData.publisher}
            onChange={handleChange}
            required
          />
        </div>

        {/* Genre */}
        <div className="space-y-2">
          <Label htmlFor="genre">Genre</Label>
          <Select
            value={formData.genre}
            onValueChange={(value) => setFormData({...formData, genre: value})}
            required
          >
            <SelectTrigger id="genre">
              <SelectValue placeholder="Sélectionner un genre" />
            </SelectTrigger>
            <SelectContent>
              {genres.map((genre) => (
                <SelectItem key={genre} value={genre}>
                  {genre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Available Copies */}
        <div className="space-y-2">
          <Label htmlFor="availableCopies">Exemplaires disponibles</Label>
          <Input
            id="availableCopies"
            name="availableCopies"
            type="number"
            min="0"
            value={formData.availableCopies}
            onChange={handleChange}
            required
          />
        </div>

        {/* Total Copies */}
        <div className="space-y-2">
          <Label htmlFor="totalCopies">Total des exemplaires</Label>
          <Input
            id="totalCopies"
            name="totalCopies"
            type="number"
            min="1"
            value={formData.totalCopies}
            onChange={handleChange}
            required
          />
        </div>

        {/* Is Ebook */}
        <div className="flex items-center space-x-2">
          <Switch
            id="isEbook"
            checked={formData.isEbook}
            onCheckedChange={handleSwitchChange}
          />
          <Label htmlFor="isEbook">Disponible en e-book</Label>
        </div>

        {/* E-book formats */}
        {formData.isEbook && (
          <div className="space-y-2">
            <Label htmlFor="fileFormats">Formats disponibles</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="formatInput"
                value={formatInput}
                onChange={(e) => setFormatInput(e.target.value)}
                placeholder="ex: PDF, EPUB, MOBI"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleAddFormat}
              >
                <PlusCircle className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {formData.fileFormats?.map((format) => (
                <Badge key={format} variant="secondary" className="flex items-center gap-1">
                  {format}
                  <button
                    type="button"
                    onClick={() => handleRemoveFormat(format)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="space-y-2">
        <Label htmlFor="summary">Résumé</Label>
        <Textarea
          id="summary"
          name="summary"
          value={formData.summary}
          onChange={handleChange}
          rows={4}
          required
        />
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <Label htmlFor="tags">Tags</Label>
        <div className="flex items-center space-x-2">
          <Input
            id="tagInput"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="Ajouter un tag"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleAddTag}
          >
            <PlusCircle className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          {formData.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Cover Image URL - Optional */}
      <div className="space-y-2">
        <Label htmlFor="coverImage">URL de la couverture (optionnel)</Label>
        <Input
          id="coverImage"
          name="coverImage"
          value={formData.coverImage || ''}
          onChange={handleChange}
          placeholder="https://example.com/cover.jpg"
        />
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">
          {book ? 'Mettre à jour' : 'Ajouter'}
        </Button>
      </div>
    </form>
  );
};

export default BookForm;
