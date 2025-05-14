import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../services/firebase';
import { collection, query, where, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';

// Tipos para las direcciones
interface Address {
  id: string;
  userId: string;
  name: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  phone?: string;
}

// Formulario de dirección en blanco
const emptyAddress = {
  id: '',
  userId: '',
  name: '',
  street: '',
  city: '',
  state: '',
  postalCode: '',
  country: '',
  isDefault: false,
  phone: ''
};

const AddressesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newAddress, setNewAddress] = useState<Omit<Address, 'id'>>(emptyAddress);

  // Redireccionar si no hay usuario logueado
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      fetchAddresses();
    }
  }, [user, navigate]);

  // Obtener direcciones del usuario
  const fetchAddresses = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const addressesRef = collection(db, 'addresses');
      const q = query(addressesRef, where('userId', '==', user.id));
      const querySnapshot = await getDocs(q);
      
      const addressData: Address[] = [];
      querySnapshot.forEach(doc => {
        addressData.push({ id: doc.id, ...doc.data() } as Address);
      });
      
      setAddresses(addressData);
    } catch (err: any) {
      console.error('Error fetching addresses:', err);
      setError('Error al cargar las direcciones. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // Agregar nueva dirección
  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    
    try {
      const addressToAdd = {
        ...newAddress,
        userId: user.id
      };
      
      await addDoc(collection(db, 'addresses'), addressToAdd);
      setNewAddress(emptyAddress);
      setIsAdding(false);
      fetchAddresses();
    } catch (err: any) {
      console.error('Error adding address:', err);
      setError('Error al guardar la dirección. Por favor, inténtalo de nuevo.');
    }
  };

  // Actualizar dirección existente
  const handleUpdateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAddress?.id) return;
    
    try {
      const addressRef = doc(db, 'addresses', editingAddress.id);
      // Extraer los campos de la dirección para la actualización y omitir 'id'
      const { id, ...updateData } = editingAddress;
      await updateDoc(addressRef, updateData);
      setEditingAddress(null);
      fetchAddresses();
    } catch (err: any) {
      console.error('Error updating address:', err);
      setError('Error al actualizar la dirección. Por favor, inténtalo de nuevo.');
    }
  };

  // Eliminar dirección
  const handleDeleteAddress = async (addressId: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta dirección?')) return;
    
    try {
      await deleteDoc(doc(db, 'addresses', addressId));
      fetchAddresses();
    } catch (err: any) {
      console.error('Error deleting address:', err);
      setError('Error al eliminar la dirección. Por favor, inténtalo de nuevo.');
    }
  };

  // Establecer dirección como predeterminada
  const setAsDefault = async (addressId: string) => {
    try {
      // Primero quitar el estado predeterminado de todas las direcciones
      const updatePromises = addresses
        .filter(addr => addr.isDefault)
        .map(addr => {
          const addrRef = doc(db, 'addresses', addr.id);
          return updateDoc(addrRef, { isDefault: false });
        });
      
      await Promise.all(updatePromises);
      
      // Luego establecer la nueva dirección predeterminada
      await updateDoc(doc(db, 'addresses', addressId), { isDefault: true });
      
      fetchAddresses();
    } catch (err: any) {
      console.error('Error setting default address:', err);
      setError('Error al establecer la dirección predeterminada. Por favor, inténtalo de nuevo.');
    }
  };

  // Manejar cambios en el formulario de edición
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingAddress) return;
    
    const { name, value, type, checked } = e.target;
    setEditingAddress({
      ...editingAddress,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Manejar cambios en el formulario de nueva dirección
  const handleNewAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setNewAddress({
      ...newAddress,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Mis Direcciones</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl">Direcciones guardadas</h2>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Agregar nueva dirección
          </button>
        )}
      </div>
      
      {loading ? (
        <p>Cargando direcciones...</p>
      ) : addresses.length === 0 ? (
        <p>No tienes direcciones guardadas.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {addresses.map(address => (
            <div 
              key={address.id} 
              className={`border rounded-lg p-4 ${address.isDefault ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
            >
              {editingAddress && editingAddress.id === address.id ? (
                <form onSubmit={handleUpdateAddress}>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Nombre</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={editingAddress.name}
                      onChange={handleEditChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="street" className="block text-gray-700 font-bold mb-2">Calle</label>
                    <input
                      type="text"
                      id="street"
                      name="street"
                      value={editingAddress.street}
                      onChange={handleEditChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="city" className="block text-gray-700 font-bold mb-2">Ciudad</label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={editingAddress.city}
                        onChange={handleEditChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="state" className="block text-gray-700 font-bold mb-2">Estado/Provincia</label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={editingAddress.state}
                        onChange={handleEditChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="postalCode" className="block text-gray-700 font-bold mb-2">Código Postal</label>
                      <input
                        type="text"
                        id="postalCode"
                        name="postalCode"
                        value={editingAddress.postalCode}
                        onChange={handleEditChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="country" className="block text-gray-700 font-bold mb-2">País</label>
                      <input
                        type="text"
                        id="country"
                        name="country"
                        value={editingAddress.country}
                        onChange={handleEditChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="phone" className="block text-gray-700 font-bold mb-2">Teléfono</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={editingAddress.phone || ''}
                      onChange={handleEditChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="isDefault"
                        checked={editingAddress.isDefault}
                        onChange={handleEditChange}
                        className="mr-2"
                      />
                      <span>Establecer como dirección predeterminada</span>
                    </label>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setEditingAddress(null)}
                      className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Guardar
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg">{address.name}</h3>
                    {address.isDefault && (
                      <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">Predeterminada</span>
                    )}
                  </div>
                  
                  <p>{address.street}</p>
                  <p>{address.city}, {address.state} {address.postalCode}</p>
                  <p>{address.country}</p>
                  {address.phone && <p>Tel: {address.phone}</p>}
                  
                  <div className="mt-4 flex justify-end space-x-2">
                    {!address.isDefault && (
                      <button
                        onClick={() => setAsDefault(address.id)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        Establecer como predeterminada
                      </button>
                    )}
                    <button
                      onClick={() => setEditingAddress(address)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteAddress(address.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Eliminar
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
      
      {isAdding && (
        <div className="mt-8 border rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Agregar nueva dirección</h2>
          <form onSubmit={handleAddAddress}>
            <div className="mb-4">
              <label htmlFor="newName" className="block text-gray-700 font-bold mb-2">Nombre</label>
              <input
                type="text"
                id="newName"
                name="name"
                value={newAddress.name}
                onChange={handleNewAddressChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
                placeholder="Ej. Casa, Trabajo"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="newStreet" className="block text-gray-700 font-bold mb-2">Calle</label>
              <input
                type="text"
                id="newStreet"
                name="street"
                value={newAddress.street}
                onChange={handleNewAddressChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
                placeholder="Calle y número"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="newCity" className="block text-gray-700 font-bold mb-2">Ciudad</label>
                <input
                  type="text"
                  id="newCity"
                  name="city"
                  value={newAddress.city}
                  onChange={handleNewAddressChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="newState" className="block text-gray-700 font-bold mb-2">Estado/Provincia</label>
                <input
                  type="text"
                  id="newState"
                  name="state"
                  value={newAddress.state}
                  onChange={handleNewAddressChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="newPostalCode" className="block text-gray-700 font-bold mb-2">Código Postal</label>
                <input
                  type="text"
                  id="newPostalCode"
                  name="postalCode"
                  value={newAddress.postalCode}
                  onChange={handleNewAddressChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="newCountry" className="block text-gray-700 font-bold mb-2">País</label>
                <input
                  type="text"
                  id="newCountry"
                  name="country"
                  value={newAddress.country}
                  onChange={handleNewAddressChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="newPhone" className="block text-gray-700 font-bold mb-2">Teléfono</label>
              <input
                type="tel"
                id="newPhone"
                name="phone"
                value={newAddress.phone || ''}
                onChange={handleNewAddressChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Opcional"
              />
            </div>
            
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={newAddress.isDefault}
                  onChange={handleNewAddressChange}
                  className="mr-2"
                />
                <span>Establecer como dirección predeterminada</span>
              </label>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setNewAddress(emptyAddress);
                }}
                className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Guardar dirección
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="mt-8">
        <Link to="/account" className="text-blue-500 hover:text-blue-700">
          &larr; Volver a mi cuenta
        </Link>
      </div>
    </div>
  );
};

export default AddressesPage; 