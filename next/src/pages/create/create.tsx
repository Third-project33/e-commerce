import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/router'; 
import axios from 'axios';
import './create.css';

const CreateProduct: React.FC = () => { 
  const router = useRouter(); 
  const [formData, setFormData] = useState<{
    title: string;
    price: string;
    image: string;
    status: string;
    rarity: string;
    chains: string;
    collection: string;
    stock: string;
    onSale: boolean;
  }>( {
    title: '',
    price: '',
    image: '',
    status: 'Available',
    rarity: 'Secret Rare',
    chains: 'ETH',
    collection: 'Shoes',
    stock: '0',
    onSale: false
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    console.log('Sending data:', formData);

    try {
      if (!formData.title || !formData.price || !formData.image || 
          !formData.rarity || !formData.chains || !formData.collection) {
        alert('Please fill in all required fields');
        return;
      }

      const response = await axios.post('http://localhost:3000/api/products/create', 
        {
          title: formData.title,
          price: formData.price,
          image: formData.image,
          status: formData.status,
          rarity: formData.rarity,
          chains: formData.chains,
          collection: formData.collection,
          stock: formData.stock,
          onSale: formData.onSale
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        console.log('Product created:', response.data);
        router.push('/products'); 
      }
    } catch (error: any) { 
      console.error('Error creating product:', error);
      alert(
        error.response?.data?.message || 
        'Error creating product. Please check all required fields.'
      );
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => { 
    const { name, value, type, checked } = e.target as HTMLInputElement; 
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => { 
    const file = e.target.files?.[0];
    if (file) {
      const data = new FormData();
      data.append('file', file);
      data.append('upload_preset', 'speakeasy');
      data.append('cloud_name', 'dc9siq9ry');
      try {
        const res = await axios.post('https://api.cloudinary.com/v1_1/dc9siq9ry/image/upload', data);
        
        setFormData(prev => ({
          ...prev,
          image: res.data.secure_url
          
        }
      ));
      } catch (err) {
        console.error('Error uploading image:', err);
        alert('Error uploading image. Please try again.');
      }
    }
  };

  return (
    <div className="CreateProductBackground">
      <div className="CreateProductWrapper">
        <form className="CreateProductForm" onSubmit={handleSubmit}>
          <h2>Create New Product</h2>
          
          <input
            type="text"
            name="title"
            placeholder="Product Title"
            value={formData.title}
            onChange={handleChange}
            className="CreateProductInput"
            required
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            className="CreateProductInput"
            step="0.01"
            min="0"
            required
          />

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="CreateProductInput"
            required
          >
            <option value="New">New</option>
            <option value="Available">Available</option>
            <option value="Not Available">Not Available</option>
          </select>

          <select
            name="rarity"
            value={formData.rarity}
            onChange={handleChange}
            className="CreateProductInput"
            required
          >
            <option value="Secret Rare">Secret Rare</option>
            <option value="Uncommon Rare">Uncommon Rare</option>
            <option value="Ultra Rare">Ultra Rare</option>
          </select>

          <input
            type="text"
            name="chains"
            placeholder="Chains (e.g., ETH)"
            value={formData.chains}
            onChange={handleChange}
            className="CreateProductInput"
            required
          />

          <select
            name="collection"
            value={formData.collection}
            onChange={handleChange}
            className="CreateProductInput"
            required
          >
            <option value="Shoes">Shoes</option>
            <option value="Dresses">Dresses</option>
            <option value="Coats">Coats</option>
            <option value="Shirts">Shirts</option>
            <option value="Pants">Pants</option>
          </select>

          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={formData.stock}
            onChange={handleChange}
            className="CreateProductInput"
            min="0"
            required
          />

          <div className="CreateProductImageSection">
            <input
              type="file"
              id="product-image"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
              className="CreateProductImageSelector"
            />
            <div 
              className="CreateProductImageAdd" 
              onClick={() => document.getElementById('product-image')?.click()}
            >
              <i className="fas fa-image"></i> Add Image
            </div>
            {formData.image && (
              <img 
                src={formData.image} 
                alt="Preview" 
                className="CreateProductImagePreview" 
              />
            )}
          </div>
          <div className="CreatedProductCheckboxGroup">
            <label>
              <input
                type="checkbox"
                name="onSale"
                checked={formData.onSale}
                onChange={handleChange}
              />
              On Sale
            </label>
          </div>

          <button type="submit" className="CreateProductSubmit">
            Create Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;