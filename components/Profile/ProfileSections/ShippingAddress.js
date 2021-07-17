import { useContext, useEffect, useState } from 'react';

import UserContext from '../../../context/UserContext';
import GeneralContext from '../../../context/GeneralContext';

import styles from '../../../styles/Profile/ProfileSections.module.css';

import { PenIcon, PlusIcon, TrashcanIcon } from '../../../utils/icons';
import { compareShippingAddressData } from '../../../utils/compareData';

export default function ShippingAddress({ user }) {
  const [form, setForm] = useState(false);
  const [shippingAddress, setShippingAddress] = useState(null);

  const { asyncWaiter } = useContext(GeneralContext);
  const { updateUserData } = useContext(UserContext);

  const createShippingAddress = async () => {
    const updatedShippingAddress = [
      ...user.shippingAddress.map((item) => ({
        recipientName: item.recipientName,
        addressLine1: item.addressLine1,
        addressLine2: item.addressLine2,
        city: item.city,
        country: item.country,
        postalCode: item.postalCode,
        phoneNumber: item.phoneNumber,
      })),
      shippingAddress,
    ];

    await updateUserData({ shippingAddress: updatedShippingAddress });
  };

  const updateShippingAddress = async () => {
    const updatedShippingAddress = [...user.shippingAddress];
    const index = updatedShippingAddress.findIndex((item) => item.id === shippingAddress.id);

    updatedShippingAddress[index].recipientName = shippingAddress.recipientName;
    updatedShippingAddress[index].address = shippingAddress.address;
    updatedShippingAddress[index].city = shippingAddress.city;
    updatedShippingAddress[index].country = shippingAddress.country;
    updatedShippingAddress[index].postalCode = shippingAddress.postalCode;
    updatedShippingAddress[index].phoneNumber = shippingAddress.phoneNumber;

    await updateUserData({ shippingAddress: updatedShippingAddress });
  };

  const deleteShippingAddress = async (shippingAddress) => {
    const updatedShippingAddress = [...user.shippingAddress.filter((item) => item.id !== shippingAddress.id)];

    await updateUserData({ shippingAddress: updatedShippingAddress });
  };

  const submitHandler = (event) => {
    event.preventDefault();

    asyncWaiter(
      async () => {
        if (shippingAddress.id) {
          await updateShippingAddress();
        } else {
          await createShippingAddress();
        }

        restartData();
      },
      true,
      'Shipping address updated successfully'
    );
  };

  const editHandler = (shippingAddress) => {
    setShippingAddress({
      id: shippingAddress.id,
      recipientName: shippingAddress.recipientName,
      addressLine1: shippingAddress.addressLine1,
      addressLine2: shippingAddress.addressLine2,
      city: shippingAddress.city,
      country: shippingAddress.country,
      postalCode: shippingAddress.postalCode,
      phoneNumber: shippingAddress.phoneNumber,
    });
    setForm(true);
  };

  const deleteHandler = (shippingAddress) =>
    asyncWaiter(
      async () => {
        await deleteShippingAddress(shippingAddress);
        restartData();
      },
      true,
      'Shipping address updated successfully'
    );

  const restartData = () => {
    localStorage.removeItem('tempShippingAddress');
    setShippingAddress(null);
    setForm(false);
  };

  useEffect(() => {
    if (shippingAddress) {
      localStorage.setItem('tempShippingAddress', JSON.stringify(shippingAddress));
      setForm(true);
    } else {
      setShippingAddress(JSON.parse(localStorage.getItem('tempShippingAddress')));
    }
  }, [shippingAddress, form]);

  return (
    <section className={styles.section}>
      {form ? (
        <form onSubmit={submitHandler}>
          <div className="form-group">
            <div className="input-control">
              <label htmlFor="recipientName">Recipient Name</label>
              <input
                type="text"
                name="recipientName"
                id="recipientName"
                placeholder="Enter your name"
                value={shippingAddress?.recipientName || ''}
                required
                onChange={(event) => setShippingAddress({ ...shippingAddress, recipientName: event.target.value })}
              />
            </div>
            <div className="form-flex">
              <div className="input-control">
                <label htmlFor="addressLine1">Address Line 1</label>
                <input
                  type="text"
                  name="addressLine1"
                  id="addressLine1"
                  placeholder="Address line 1"
                  value={shippingAddress?.addressLine1 || ''}
                  required
                  onChange={(event) => setShippingAddress({ ...shippingAddress, addressLine1: event.target.value })}
                />
              </div>
              <div className="input-control">
                <label htmlFor="addressLine2">Address Line 2</label>
                <input
                  type="text"
                  name="addressLine2"
                  id="addressLine2"
                  placeholder="Address line 2"
                  value={shippingAddress?.addressLine2 || ''}
                  required
                  onChange={(event) => setShippingAddress({ ...shippingAddress, addressLine2: event.target.value })}
                />
              </div>
            </div>
            <div className="input-control">
              <label htmlFor="city">City</label>
              <input
                type="text"
                name="city"
                id="city"
                placeholder="Enter your city"
                value={shippingAddress?.city || ''}
                required
                onChange={(event) => setShippingAddress({ ...shippingAddress, city: event.target.value })}
              />
            </div>
            <div className="input-control column-two">
              <label htmlFor="country">Country</label>
              <input
                type="text"
                name="country"
                id="country"
                placeholder="Enter your country"
                value={shippingAddress?.country || ''}
                required
                onChange={(event) => setShippingAddress({ ...shippingAddress, country: event.target.value })}
              />
            </div>
            <div className="input-control column-two">
              <label htmlFor="postalCode">Postal Code</label>
              <input
                type="text"
                name="postalCode"
                id="postalCode"
                placeholder="Enter your postal code"
                value={shippingAddress?.postalCode || ''}
                required
                onChange={(event) => setShippingAddress({ ...shippingAddress, postalCode: event.target.value })}
              />
            </div>
            <div className="input-control column-two">
              <label htmlFor="recipientPhoneNumber">Phone Number</label>
              <input
                type="text"
                name="recipientPhoneNumber"
                id="recipientPhoneNumber"
                placeholder="Enter your phone number"
                value={shippingAddress?.phoneNumber || ''}
                required
                onChange={(event) => setShippingAddress({ ...shippingAddress, phoneNumber: event.target.value })}
              />
            </div>
          </div>
          <div className={styles.formButtons}>
            <button type="button" className="btn btn-block btn-danger" onClick={restartData}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-block btn-primary"
              disabled={
                shippingAddress?.id
                  ? compareShippingAddressData(
                      shippingAddress,
                      user?.shippingAddress.find((item) => item.id === shippingAddress.id)
                    )
                  : false
              }
            >
              Save
            </button>
          </div>
        </form>
      ) : (
        <>
          <ul>
            {user.shippingAddress.map((item) => (
              <li key={item.id} className={styles.addressList}>
                <div>
                  <p>{item.recipientName}</p>
                  <p>{item.addressLine1}</p>
                  <p>{item.addressLine2}</p>
                  <p>{`${item.city}, ${item.country}`}</p>
                  <p>{item.postalCode}</p>
                  <p>{item.phoneNumber}</p>
                </div>
                <div>
                  <button type="button" onClick={() => deleteHandler(item)}>
                    <TrashcanIcon />
                  </button>
                  <button type="button" onClick={() => editHandler(item)}>
                    <PenIcon />
                  </button>
                </div>
              </li>
            ))}
            {user.shippingAddress.length < 10 && (
              <li className={styles.addAddress}>
                <button type="button" onClick={() => setForm(true)}>
                  <span className="inline-icon">
                    <PlusIcon />
                  </span>
                  <span>Add new address</span>
                </button>
              </li>
            )}
          </ul>
        </>
      )}
    </section>
  );
}
