import { useEffect, useState } from 'react';

import styles from '../../../styles/Checkout/CheckoutSections.module.css';

import { PlusIcon } from '../../../utils/icons';

export default function ShippingAddress({ user, order, setOrder, setStep }) {
  const [form, setForm] = useState(false);
  const [shippingAddress, setShippingAddress] = useState(null);

  const nextHandler = (event) => {
    event.preventDefault();

    if (shippingAddress) {
      setOrder({ ...order, shippingAddress });
    }

    setStep(3);
  };

  const resetHandler = () => {
    setForm(false);
    setShippingAddress(null);
    localStorage.removeItem('orderShippingAddress');

    setOrderShippingAddress(0);
  };

  const setOrderShippingAddress = (index) => {
    if (!user.shippingAddress.length) {
      return setOrder(null);
    }

    const shippingAddress = user.shippingAddress[index];
    const data = {
      ...order,
      shippingAddress: {
        id: index,
        recipientName: shippingAddress.recipientName,
        addressLine1: shippingAddress.addressLine1,
        addressLine2: shippingAddress.addressLine2,
        city: shippingAddress.city,
        country: shippingAddress.country,
        postalCode: shippingAddress.postalCode,
        phoneNumber: shippingAddress.phoneNumber,
      },
    };

    localStorage.setItem('tempOrder', JSON.stringify(data));
    setOrder(data);
  };

  useEffect(() => {
    if (shippingAddress) {
      localStorage.setItem('orderShippingAddress', JSON.stringify(shippingAddress));
      setForm(true);
    } else {
      setShippingAddress(JSON.parse(localStorage.getItem('orderShippingAddress')));
    }
  }, [shippingAddress]);

  return (
    <>
      <h1 className={styles.title}>
        <span>Shipping Address</span>
      </h1>
      <section className={styles.section}>
        {form ? (
          <form onSubmit={nextHandler}>
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
              <button type="button" className="btn btn-block btn-danger" onClick={resetHandler}>
                Cancel
              </button>
              <button type="submit" className="btn btn-block btn-primary">
                Next
              </button>
            </div>
          </form>
        ) : (
          <form className={styles.options} onSubmit={nextHandler}>
            <div>
              {user.shippingAddress.map((item, index) => (
                <div key={item.id} className={`${styles.addressList} input-radio`}>
                  <span>
                    <input
                      type="radio"
                      name="shippingAddress"
                      id={index}
                      value={index}
                      defaultChecked={order && (order.shippingAddress?.id === index || index === 0)}
                      onChange={() => setOrderShippingAddress(index)}
                    />
                    <label htmlFor={index}>
                      <p>{item.recipientName}</p>
                      <p>{item.addressLine1}</p>
                      <p>{item.addressLine2}</p>
                      <p>{`${item.city}, ${item.country}`}</p>
                      <p>{item.postalCode}</p>
                      <p>{item.phoneNumber}</p>
                    </label>
                  </span>
                </div>
              ))}

              <div className={styles.addAddress}>
                <button type="button" onClick={() => setForm(true)}>
                  <span className="inline-icon">
                    <PlusIcon />
                  </span>
                  <span>Enter new address</span>
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-block btn-primary" disabled={!order?.shippingAddress}>
              Next
            </button>
          </form>
        )}
      </section>
    </>
  );
}
