export const validateOfferBannerField = (name, value, offerType = '', imagePreview = null, isEditing = false) => {
  let error = '';
  switch (name) {
    case 'title':
      if (!value.trim()) {
        error = 'Title is required';
      }
      break;
    case 'image':
      if (!imagePreview && !isEditing) {
        error = 'Image is required';
      }
      break;
    case 'description':
      if (!value.trim()) {
        error = 'Description is required';
      } else if (value.trim().split(/\s+/).length < 20) {
        error = 'Description must be at least 20 words';
      }
      break;
    case 'offerValue':
      if (!value) {
        error = 'Offer value is required';
      } else if (offerType === 'percentage') {
        if (value < 0 || value > 100) {
          error = 'Percentage must be between 0 and 100';
        }
      } else if (offerType === 'fixed') {
        if (value <= 0) {
          error = 'Price must be greater than 0';
        }
      }
      break;
    case 'link':
      if (!value.trim()) {
        error = 'Link is required';
      }
      break;
    default:
      break;
  }
  return error;
};

export const validateOfferBannerForm = (formData, imagePreview, isEditing) => {
  return {
    title: validateOfferBannerField('title', formData.title),
    image: validateOfferBannerField('image', null, null, imagePreview, isEditing),
    description: validateOfferBannerField('description', formData.description),
    offerValue: validateOfferBannerField('offerValue', formData.offerValue, formData.offerType),
    link: validateOfferBannerField('link', formData.link)
  };
};