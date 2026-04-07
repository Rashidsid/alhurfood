import { useState } from 'react';
import { usePromoCodes } from '../context/PromoCodeContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Badge } from '../components/ui/badge';
import { Switch } from '../components/ui/switch';
import { Pencil, Trash2, Plus, Tag } from 'lucide-react';
import { toast } from 'sonner';
import { PromoCode } from '../types';

export default function AdminPromoCodes() {
  const { promoCodes, addPromoCode, updatePromoCode, deletePromoCode } = usePromoCodes();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<PromoCode | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    discount: '',
    active: true,
    expiryDate: '',
  });

  const resetForm = () => {
    setFormData({
      code: '',
      discount: '',
      active: true,
      expiryDate: '',
    });
    setEditingPromo(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.code || !formData.discount) {
      toast.error('Please fill in all required fields');
      return;
    }

    const discount = parseFloat(formData.discount);
    if (isNaN(discount) || discount <= 0 || discount > 100) {
      toast.error('Discount must be between 0 and 100');
      return;
    }

    const promoData = {
      code: formData.code.toUpperCase(),
      discount,
      active: formData.active,
      expiryDate: formData.expiryDate || undefined,
    };

    if (editingPromo) {
      updatePromoCode(editingPromo.id, promoData);
      toast.success('Promo code updated successfully!');
    } else {
      addPromoCode(promoData);
      toast.success('Promo code added successfully!');
    }

    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEdit = (promo: PromoCode) => {
    setEditingPromo(promo);
    setFormData({
      code: promo.code,
      discount: promo.discount.toString(),
      active: promo.active,
      expiryDate: promo.expiryDate || '',
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = (id: string, code: string) => {
    if (confirm(`Are you sure you want to delete promo code "${code}"?`)) {
      deletePromoCode(id);
      toast.success('Promo code deleted successfully!');
    }
  };

  const toggleActive = (id: string, currentStatus: boolean) => {
    updatePromoCode(id, { active: !currentStatus });
    toast.success(`Promo code ${!currentStatus ? 'activated' : 'deactivated'}!`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl mb-2">Promo Codes</h1>
          <p className="text-gray-600">Manage discount codes for your customers</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Promo Code
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingPromo ? 'Edit Promo Code' : 'Add New Promo Code'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="code">Code *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="SAVE20"
                  required
                />
              </div>
              <div>
                <Label htmlFor="discount">Discount (%) *</Label>
                <Input
                  id="discount"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={formData.discount}
                  onChange={e => setFormData({ ...formData, discount: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={e => setFormData({ ...formData, expiryDate: e.target.value })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="active">Active</Label>
                <Switch
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingPromo ? 'Update Code' : 'Add Code'}
                </Button>
                <Button type="button" variant="outline" onClick={() => {
                  resetForm();
                  setIsAddDialogOpen(false);
                }}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Promo Codes ({promoCodes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {promoCodes.length === 0 ? (
            <p className="text-center text-gray-600 py-8">No promo codes yet</p>
          ) : (
            <div className="space-y-4">
              {promoCodes.map(promo => (
                <div key={promo.id} className="flex items-center justify-between pb-4 border-b last:border-b-0">
                  <div className="flex items-center gap-4">
                    <div className="bg-orange-100 p-3 rounded-lg">
                      <Tag className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-mono">{promo.code}</h3>
                        <Badge variant={promo.active ? 'default' : 'secondary'}>
                          {promo.active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {promo.discount}% discount
                        {promo.expiryDate && ` • Expires: ${new Date(promo.expiryDate).toLocaleDateString()}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={promo.active}
                      onCheckedChange={() => toggleActive(promo.id, promo.active)}
                    />
                    <Button variant="outline" size="sm" onClick={() => handleEdit(promo)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(promo.id, promo.code)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
