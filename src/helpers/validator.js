let validateIdentityPayload = (identity) => {
  if (
    (identity.email && identity.email.trim() !== '') ||
    (identity.phoneNumber && identity.phoneNumber.trim() !== '')
  ) {
    return { status: true, message: 'Validated Successfully' };
  } else {
    return {
      status: false,
      message: 'Invalid data, either email or phoneNumber is required',
    };
  }
};

module.exports = { validateIdentityPayload };
