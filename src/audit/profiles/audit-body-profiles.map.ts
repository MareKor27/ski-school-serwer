import { AuditEvent } from './audit-body-profile.enum';
import { AuditEventConfig } from './audit-option.type';

export const auditBodyProfiles: Record<AuditEvent, AuditEventConfig> = {
  [AuditEvent.AUTH_LOGIN_TO_SYSTEM]: {
    action: 'AUTH_LOGIN_TO_SYSTEM',
    bodyMapper: (body) => ({
      email: body.email,
    }),
    responseMapper: (response) => ({
      id: response.user.id,
      email: response.user.email,
    }),
  },

  [AuditEvent.USER_UPDATE]: {
    action: 'USER_UPDATE',
    bodyMapper: (body) => ({
      name: body.name,
      email: body.email,
      iconColor: body.iconColor,
    }),
    responseMapper: (response) => ({
      id: response.content.id,
      name: response.content.name,
      email: response.content.email,
      iconColor: response.content.iconColor,
    }),
  },

  [AuditEvent.USER_DELETE]: {
    action: 'USER_DELETE',
    bodyMapper: (body) => ({
      id: body.id,
      name: body.name,
    }),
  },

  [AuditEvent.AUTH_RESET_PASSWORD]: {
    action: 'AUTH_RESET_PASSWORD',
    bodyMapper: (body) => ({
      id: body.id,
      name: body.name,
      email: body.email,
    }),
  },

  [AuditEvent.RESERVATION_CREATE]: {
    action: 'RESERVATION_CREATE',
    bodyMapper: (body) => ({
      reservationId: body.reservationId,
      fullName: body.fullName,
      email: body.email,
      purchasedTime: body.purchasedTime,
      participants: body.participants,
      ageOfParticipants: body.ageOfParticipants,
      advancement: body.advancement,
      chosenEquipment: body.chosenEquipment,
      additionalComments: body.additionalComments,
      insuranceInformation: body.insuranceInformation,
    }),
    responseMapper: (response) => ({
      reservationId: response.content.id,
      email: response.content.email,
      fullName: response.content.fullName,
      advancement: response.content.advancement,
      phoneNumber: response.content.phoneNumber,
      chosenEquipment: response.content.chosenEquipment,
      ageOfParticipants: response.content.ageOfParticipants,
      additionalComments: response.content.additionalComments,
      insuranceInformation: response.content.insuranceInformation,
      appointments: response.content.appointments.map((a) => ({
        id: a.id,
        appointmentDate: a.appointmentDate,
        instructorId: a.instructorId,
      })),
    }),
  },

  [AuditEvent.RESERVATION_DELETE]: {
    action: 'RESERVATION_DELETE',
    bodyMapper: (body) => ({
      id: body.id,
    }),
  },
  [AuditEvent.AUTH_RESERVATION_VERIFICATION]: {
    action: 'AUTH_RESERVATION_VERIFICATION',
    bodyMapper: (body) => ({ body }),
    responseMapper: (response) => ({
      reservationId: response.content.id,
      email: response.content.email,
      fullName: response.content.fullName,
      advancement: response.content.advancement,
      phoneNumber: response.content.phoneNumber,
      chosenEquipment: response.content.chosenEquipment,
      ageOfParticipants: response.content.ageOfParticipants,
      additionalComments: response.content.additionalComments,
      insuranceInformation: response.content.insuranceInformation,
      appointments: response.content.appointments.map((a) => ({
        id: a.id,
        appointmentDate: a.appointmentDate,
        instructorId: a.instructorId,
      })),
    }),
  },

  [AuditEvent.APPO_BY_HOUR]: {
    action: 'APPO_BY_HOUR',
    bodyMapper: (body) => ({
      date: body.date,
      hour: body.hour,
      instructorId: body.instructorId,
    }),
  },
  [AuditEvent.APPO_ADM_MODIFIES_USERS]: {
    action: 'APPO_ADM_MODIFIES_USERS',
    bodyMapper: (body) => ({
      appointmentDate: body.appointmentDate,
    }),
    responseMapper: (response) => ({
      id: response.content.id,
      instructorId: response.content.instructorId,
      appointmentDate: response.content.appointmentDate,
      message: response.message,
    }),
  },

  [AuditEvent.APPO_INS_MODIFIES]: {
    action: 'APPO_INS_MODIFIES',
    bodyMapper: (body) => ({ appointmentDate: body.appointmentDate }),
    responseMapper: (response) => ({
      id: response.content.id,
      instructorId: response.content.instructorId,
      appointmentDate: response.content.appointmentDate,
    }),
  },

  [AuditEvent.APPO_PATCH]: {
    action: 'APPO_PATCH',
    bodyMapper: (body) => ({ body }),
  },

  [AuditEvent.APPO_DELETE]: {
    action: 'APPO_DELETE',
    bodyMapper: (body) => ({
      massage: 'Appointment deletion requested',
    }),
    responseMapper: (response) => ({
      id: response.content.id,
      instructorId: response.content.instructor.id,
      instructorName: response.content.instructor.name,
      appointmentDate: response.content.appointmentDate,
      message: response.message,
    }),
  },

  [AuditEvent.APPO_BY_DAY]: {
    action: 'APPO_BY_DAY',
    bodyMapper: (body) => ({
      checked: body.checked,
      chosenDate: body.chosenDate,
    }),
  },

  [AuditEvent.REMOVE_EXPIRED_TOKENS]: {
    action: 'REMOVE_EXPIRED_TOKENS',
    bodyMapper: (body) => ({
      body,
    }),
  },
};
