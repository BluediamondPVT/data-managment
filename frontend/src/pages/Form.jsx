// import React, { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { 
//   Card, 
//   Form, 
//   Button, 
//   Container, 
//   Row, 
//   Col, 
//   InputGroup, 
//   Badge, 
//   Spinner,
//   Alert
// } from 'react-bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';
// // import 'bootstrap-icons/font/bootstrap-icons.css';

// const AddUserForm = () => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//     reset,
//     watch
//   } = useForm({
//     defaultValues: {
//       name: '',
//       phoneNumber: '',
//       reference: '',
//       remark: ''
//     }
//   });
  
//   const [formStatus, setFormStatus] = useState({ type: '', message: '' });
//   const [showSuccess, setShowSuccess] = useState(false);
  
//   const watchedFields = watch();
//   const filledFields = Object.values(watchedFields).filter(val => val.trim()).length;
//   const totalFields = Object.keys(watchedFields).length;
//   const completionPercentage = Math.round((filledFields / totalFields) * 100);

//   const onSubmit = async (data) => {
//     // Clear any previous status
//     setFormStatus({ type: '', message: '' });
    
//     // Add timestamp
//     data.createdAt = new Date();

//     try {
//       const response = await fetch(`${import.meta.env.REACT_APP_API_URL}/api/customers`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(data),
//       });

//       const result = await response.json();

//       if (response.ok) {
//         toast.success('User added successfully!');
//         setFormStatus({ 
//           type: 'success', 
//           message: 'User added successfully! You can add another user or check the customer list.'
//         });
//         setShowSuccess(true);
//         reset();
        
//         // Hide success message after 5 seconds
//         setTimeout(() => {
//           setShowSuccess(false);
//         }, 5000);
//       } else {
//         toast.error(result.message || 'Something went wrong!');
//         setFormStatus({ 
//           type: 'danger', 
//           message: result.message || 'Failed to add user. Please try again.'
//         });
//       }
//     } catch (error) {
//       console.error('Submission Error:', error);
//       toast.error('Failed to submit form.');
//       setFormStatus({ 
//         type: 'danger', 
//         message: 'Network error. Please check your connection and try again.'
//       });
//     }
//   };

//   const handleReset = () => {
//     if (confirm('Are you sure you want to clear the form?')) {
//       reset();
//       setFormStatus({ type: '', message: '' });
//     }
//   };

//   return (
//     <Container >
//       <ToastContainer position="top-right" autoClose={3000} />
      
//       <Row className="justify-content-center">
//         <Col lg={12} xl={12}>
//           <Card className="shadow border-0 overflow-hidden">
//             <div className="position-absolute top-0 start-0 w-100 bg-primary" style={{ height: '5px' }}></div>
            
//             <Card.Header className="bg-primary bg-gradient text-white ">
//               <div className="d-flex justify-content-between align-items-center">
//                 <div>
//                   <h3 className="mb-0">
//                     <i className="bi bi-person-plus-fill me-2"></i>
//                     Add New Customer
//                   </h3>
//                   {/* <p className="mb-0 mt-1 text-white-50">Fill out the form to add a new customer to the database</p> */}
//                 </div>
//                 <Badge bg="light" text="dark" pill className="fs-6">
//                   {completionPercentage}% Complete
//                 </Badge>
//               </div>
//             </Card.Header>
            
//             <Card.Body className="p-4">
//               {showSuccess && (
//                 <Alert 
//                   variant="success" 
//                   className="d-flex align-items-center mb-4"
//                   onClose={() => setShowSuccess(false)} 
//                   dismissible
//                 >
//                   <i className="bi bi-check-circle-fill me-2 fs-4"></i>
//                   <div>
//                     <strong>Success!</strong> {formStatus.message}
//                   </div>
//                 </Alert>
//               )}
              
//               {formStatus.type === 'danger' && (
//                 <Alert 
//                   variant="danger" 
//                   className="d-flex align-items-center mb-4" 
//                   onClose={() => setFormStatus({ type: '', message: '' })} 
//                   dismissible
//                 >
//                   <i className="bi bi-exclamation-triangle-fill me-2 fs-4"></i>
//                   <div>
//                     <strong>Error!</strong> {formStatus.message}
//                   </div>
//                 </Alert>
//               )}
              
//               <Form onSubmit={handleSubmit(onSubmit)}>
//                 <Row>
//                   <Col md={6}>
//                     {/* Name */}
//                     <Form.Group className="mb-2" controlId="formName">
//                       <Form.Label className="fw-bold">
//                         Full Name <span className="text-danger">*</span>
//                       </Form.Label>
//                       <InputGroup hasValidation>
//                         <InputGroup.Text>
//                           <i className="bi bi-person"></i>
//                         </InputGroup.Text>
//                         <Form.Control
//                           type="text"
//                           placeholder="Enter customer's name"
//                           isInvalid={!!errors.name}
//                           className="py-2"
//                           {...register('name', { 
//                             required: 'Name is required',
//                             minLength: {
//                               value: 2,
//                               message: 'Name must be at least 2 characters'
//                             }
//                           })}
//                         />
//                         <Form.Control.Feedback type="invalid">
//                           {errors.name?.message}
//                         </Form.Control.Feedback>
//                       </InputGroup>
//                       {/* <Form.Text className="text-muted">
//                         Enter the customer's full name
//                       </Form.Text> */}
//                     </Form.Group>
//                   </Col>
                  
//                   <Col md={6}>
//                     {/* Phone Number */}
//                     <Form.Group className="mb-2" controlId="formPhone">
//                       <Form.Label className="fw-bold">
//                         Phone Number <span className="text-danger">*</span>
//                       </Form.Label>
//                       <InputGroup hasValidation>
//                         <InputGroup.Text>
//                           <i className="bi bi-telephone"></i>
//                         </InputGroup.Text>
//                         <Form.Control
//                           type="text"
//                           placeholder="Enter phone number"
//                           isInvalid={!!errors.phoneNumber}
//                           className="py-2"
//                           {...register('phoneNumber', {
//                             required: 'Phone number is required',
//                             pattern: {
//                               value: /^[0-9]{10,15}$/,
//                               message: 'Enter a valid phone number (10-15 digits)'
//                             }
//                           })}
//                         />
//                         <Form.Control.Feedback type="invalid">
//                           {errors.phoneNumber?.message}
//                         </Form.Control.Feedback>
//                       </InputGroup>
//                       {/* <Form.Text className="text-muted">
//                         Numbers only, 10-15 digits
//                       </Form.Text> */}
//                     </Form.Group>
//                   </Col>
//                 </Row>

//                 {/* Reference */}
//                 <Form.Group className="mb-2" controlId="formReference">
//                   <Form.Label className="fw-bold">Reference</Form.Label>
//                   <InputGroup>
//                     <InputGroup.Text>
//                       <i className="bi bi-link-45deg"></i>
//                     </InputGroup.Text>
//                     <Form.Control
//                       type="text"
//                       placeholder="How did they hear about us? (Optional)"
//                       className="py-2"
//                       {...register('reference')}
//                     />
//                   </InputGroup>
//                   <Form.Text className="text-muted">
//                     E.g., Referral, Advertisement, Social Media
//                   </Form.Text>
//                 </Form.Group>

//                 {/* Remark */}
//                 <Form.Group className="mb-2" controlId="formRemark">
//                   <Form.Label className="fw-bold">Remarks</Form.Label>
//                   <InputGroup>
//                     <InputGroup.Text>
//                       <i className="bi bi-chat-left-text"></i>
//                     </InputGroup.Text>
//                     <Form.Control
//                       as="textarea"
//                       rows={3}
//                       placeholder="Any additional notes or comments (Optional)"
//                       className="py-2"
//                       {...register('remark')}
//                     />
//                   </InputGroup>
//                   <Form.Text className="text-muted">
//                     Add any additional information about this customer
//                   </Form.Text>
//                 </Form.Group>

//                 {/* Creation Time - Hidden field that will be filled on submit */}
//                 {/* <div className="d-flex align-items-center mb-4 pb-2 border-bottom">
//                   <i className="bi bi-clock-history fs-5 me-2 text-muted"></i>
//                   <div>
//                     <span className="text-muted">Form Submission Time: </span>
//                     <span className="fw-bold">Will be recorded automatically</span>
//                   </div>
//                 </div> */}

//                 {/* Action Buttons */}
//                 <Row className="mt-2">
//                   <Col xs={12} md={6} className="mb-3 mb-md-0">
//                     <Button 
//                       variant="outline-secondary" 
//                       className="w-100 py-2"
//                       onClick={handleReset}
//                       type="button"
//                     >
//                       <i className="bi bi-x-circle me-2"></i>
//                       Clear Form
//                     </Button>
//                   </Col>
//                   <Col xs={12} md={6}>
//                     <Button 
//                       variant="primary" 
//                       className="w-100 py-2"
//                       type="submit"
//                       disabled={isSubmitting}
//                     >
//                       {isSubmitting ? (
//                         <>
//                           <Spinner 
//                             as="span" 
//                             animation="border" 
//                             size="sm" 
//                             className="me-2"
//                           />
//                           Submitting...
//                         </>
//                       ) : (
//                         <>
//                           <i className="bi bi-check-circle me-2"></i>
//                           Add Customer
//                         </>
//                       )}
//                     </Button>
//                   </Col>
//                 </Row>
//               </Form>
//             </Card.Body>
            
//             {/* <Card.Footer className="bg-light border-0 p-3">
//               <div className="text-center text-muted small">
//                 <i className="bi bi-shield-check me-1"></i>
//                 All information is securely stored and protected
//               </div>
//             </Card.Footer> */}
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default AddUserForm;


import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  Card, 
  Form, 
  Button, 
  Container, 
  Row, 
  Col, 
  InputGroup, 
  Badge, 
  Spinner,
  Alert
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const AddUserForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch
  } = useForm({
    defaultValues: {
      name: '',
      phoneNumber: '',
      source: '',
      service: ''
    }
  });
  
  const [formStatus, setFormStatus] = useState({ type: '', message: '' });
  const [showSuccess, setShowSuccess] = useState(false);
  
  const watchedFields = watch();
  const filledFields = Object.values(watchedFields).filter(val => val.trim()).length;
  const totalFields = Object.keys(watchedFields).length;
  const completionPercentage = Math.round((filledFields / totalFields) * 100);

  const onSubmit = async (data) => {
    setFormStatus({ type: '', message: '' });
    
    try {
      const response = await fetch(`${import.meta.env.REACT_APP_API_URL}/api/customers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Customer added successfully!');
        setFormStatus({ 
          type: 'success', 
          message: 'Customer added successfully! You can add another or check the customer list.'
        });
        setShowSuccess(true);
        reset();
        
        setTimeout(() => {
          setShowSuccess(false);
        }, 5000);
      } else {
        toast.error(result.message || 'Something went wrong!');
        setFormStatus({ 
          type: 'danger', 
          message: result.message || 'Failed to add customer. Please try again.'
        });
      }
    } catch (error) {
      console.error('Submission Error:', error);
      toast.error('Failed to submit form.');
      setFormStatus({ 
        type: 'danger', 
        message: 'Network error. Please check your connection and try again.'
      });
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to clear the form?')) {
      reset();
      setFormStatus({ type: '', message: '' });
    }
  };

  return (
    <Container>
      <ToastContainer position="top-right" autoClose={3000} />
      
      <Row className="justify-content-center">
        <Col lg={12} xl={12}>
          <Card className="shadow border-0 overflow-hidden">
            <div className="position-absolute top-0 start-0 w-100 bg-primary" style={{ height: '5px' }}></div>
            
            <Card.Header className="bg-primary bg-gradient text-white ">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h3 className="mb-0">
                    <i className="bi bi-person-plus-fill me-2"></i>
                    Add New Customer
                  </h3>
                </div>
                <Badge bg="light" text="dark" pill className="fs-6">
                  {completionPercentage}% Complete
                </Badge>
              </div>
            </Card.Header>
            
            <Card.Body className="p-4">
              {showSuccess && (
                <Alert 
                  variant="success" 
                  className="d-flex align-items-center mb-4"
                  onClose={() => setShowSuccess(false)} 
                  dismissible
                >
                  <i className="bi bi-check-circle-fill me-2 fs-4"></i>
                  <div>
                    <strong>Success!</strong> {formStatus.message}
                  </div>
                </Alert>
              )}
              
              {formStatus.type === 'danger' && (
                <Alert 
                  variant="danger" 
                  className="d-flex align-items-center mb-4" 
                  onClose={() => setFormStatus({ type: '', message: '' })} 
                  dismissible
                >
                  <i className="bi bi-exclamation-triangle-fill me-2 fs-4"></i>
                  <div>
                    <strong>Error!</strong> {formStatus.message}
                  </div>
                </Alert>
              )}
              
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-2" controlId="formName">
                      <Form.Label className="fw-bold">
                        Full Name <span className="text-danger">*</span>
                      </Form.Label>
                      <InputGroup hasValidation>
                        <InputGroup.Text>
                          <i className="bi bi-person"></i>
                        </InputGroup.Text>
                        <Form.Control
                          type="text"
                          placeholder="Enter customer's name"
                          isInvalid={!!errors.name}
                          className="py-2"
                          {...register('name', { 
                            required: 'Name is required',
                            minLength: {
                              value: 2,
                              message: 'Name must be at least 2 characters'
                            }
                          })}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.name?.message}
                        </Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-2" controlId="formPhone">
                      <Form.Label className="fw-bold">
                        Phone Number <span className="text-danger">*</span>
                      </Form.Label>
                      <InputGroup hasValidation>
                        <InputGroup.Text>
                          <i className="bi bi-telephone"></i>
                        </InputGroup.Text>
                        <Form.Control
                          type="text"
                          placeholder="Enter phone number"
                          isInvalid={!!errors.phoneNumber}
                          className="py-2"
                          {...register('phoneNumber', {
                            required: 'Phone number is required',
                            pattern: {
                              value: /^[0-9]{10,15}$/,
                              message: 'Enter a valid phone number (10-15 digits)'
                            }
                          })}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.phoneNumber?.message}
                        </Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-2" controlId="formSource">
                      <Form.Label className="fw-bold">Source</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <i className="bi bi-source"></i>
                        </InputGroup.Text>
                        <Form.Control
                          type="text"
                          placeholder="Customer source (Optional)"
                          className="py-2"
                          {...register('source')}
                        />
                      </InputGroup>
                      <Form.Text className="text-muted">
                        E.g., Website, Referral
                      </Form.Text>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-2" controlId="formService">
                      <Form.Label className="fw-bold">Service</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <i className="bi bi-gear"></i>
                        </InputGroup.Text>
                        <Form.Control
                          type="text"
                          placeholder="Selected service (Optional)"
                          className="py-2"
                          {...register('service')}
                        />
                      </InputGroup>
                      <Form.Text className="text-muted">
                        E.g., Consultation, Repair,
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mt-2">
                  <Col xs={12} md={6} className="mb-3 mb-md-0">
                    <Button 
                      variant="outline-secondary" 
                      className="w-100 py-2"
                      onClick={handleReset}
                      type="button"
                    >
                      <i className="bi bi-x-circle me-2"></i>
                      Clear Form
                    </Button>
                  </Col>
                  <Col xs={12} md={6}>
                    <Button 
                      variant="primary" 
                      className="w-100 py-2"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Spinner 
                            as="span" 
                            animation="border" 
                            size="sm" 
                            className="me-2"
                          />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-circle me-2"></i>
                          Add Customer
                        </>
                      )}
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AddUserForm;