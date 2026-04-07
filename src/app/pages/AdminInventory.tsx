import { useState } from 'react';
import { useProducts } from '../context/ProductContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Pencil, Search } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminInventory() {
  const { products, updateProduct } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStock, setEditStock] = useState('');

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpdateStock = (productId: string) => {
    const newStock = parseInt(editStock);
    if (isNaN(newStock) || newStock < 0) {
      toast.error('Please enter a valid stock number');
      return;
    }

    updateProduct(productId, { stock: newStock });
    toast.success('Stock updated successfully!');
    setEditingId(null);
    setEditStock('');
  };

  const startEditing = (product: any) => {
    setEditingId(product.id);
    setEditStock(product.stock.toString());
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditStock('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Inventory Management</h1>
        <p className="text-gray-600">Monitor and update product stock levels</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 mb-1">Total Products</p>
            <p className="text-3xl">{products.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 mb-1">Low Stock (&lt;20)</p>
            <p className="text-3xl text-orange-600">
              {products.filter(p => p.stock < 20 && p.stock > 0).length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 mb-1">Out of Stock</p>
            <p className="text-3xl text-red-600">
              {products.filter(p => p.stock === 0).length}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Stock</CardTitle>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredProducts.map(product => (
              <div key={product.id} className="flex items-center gap-4 pb-4 border-b last:border-b-0">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-medium">{product.name}</h3>
                  <p className="text-sm text-gray-600 capitalize">
                    {product.category.replace('-', ' ')}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {editingId === product.id ? (
                    <>
                      <Input
                        type="number"
                        value={editStock}
                        onChange={e => setEditStock(e.target.value)}
                        className="w-24"
                        min="0"
                      />
                      <Button size="sm" onClick={() => handleUpdateStock(product.id)}>
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={cancelEditing}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Badge
                        variant={
                          product.stock === 0 ? 'destructive' :
                          product.stock < 10 ? 'default' :
                          product.stock < 20 ? 'secondary' :
                          'outline'
                        }
                        className="min-w-[80px] justify-center"
                      >
                        Stock: {product.stock}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEditing(product)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
            {filteredProducts.length === 0 && (
              <p className="text-center text-gray-600 py-8">No products found</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
