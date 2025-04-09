
interface WixFormPayload {
  formName: string;
  submissionTime: string;
  submissionId: string;
  contactId: string;
  formType: string;
  formId: string;
  contact?: {
    name?: {
      first?: string;
      last?: string;
    };
    email?: string;
    phone?: string;
  };
  [key: string]: any; // For dynamic field values
}

/**
 * Handles webhook requests from Wix form submissions
 * Extracts client information and stores it in the database
 */
export async function handleWixSignupFormWebhook(req: Request, parsedPayload?: any) {
  try {
    console.log('[WEBHOOK HANDLER] Starting to process webhook');
    
    // Use the pre-parsed payload if provided, otherwise parse the request body
    let payload: WixFormPayload;
    try {
      payload = parsedPayload || await req.json();
      console.log('[WEBHOOK HANDLER] Successfully parsed payload');
      console.log('[WEBHOOK HANDLER] Payload structure:', Object.keys(payload));
      if (payload.data) {
        console.log('[WEBHOOK HANDLER] Data structure:', Object.keys(payload.data));
      }
    } catch (parseError) {
      console.error('[WEBHOOK HANDLER] Failed to parse request body:', parseError);
      throw new Error(`Failed to parse request body: ${parseError.message}`);
    }
    
    // Extract client information from the payload
    // Check if the payload has a data property (new format from logs)
    const data = payload.data || payload;
    
    // First try to get data from the contact object if available
    // Use let instead of const since we might update these values from the submissions array
    let firstName = data.contact?.name?.first || 
      // Look for firstName fields in various formats
      data['field:first_name_13c3'] ||
      data['field:firstName_1'] || 
      data['firstName'] || 
      '';
      
    let lastName = data.contact?.name?.last || 
      data['field:last_name_7aa5'] ||
      data['field:lastName_1'] || 
      data['lastName'] || 
      '';
      
    let email = data.contact?.email || 
      data['field:email_65e2'] ||
      data['field:email_1'] || 
      data['email'] || 
      '';
      
    let phone = data.contact?.phone || 
      data['field:phone_bd01'] ||
      data['field:phone_1'] || 
      '';
    
    // Extract any additional fields that might be useful
    let referralSource = data['field:who_asked_you_to_take_this_class'] ||
      data['field:comp-kr2g0lkp'] || 
      data['referralSource'] || 
      '';
      
    let notes = data['field:what_class_are_you_taking'] ||
      data['field:paragraph_1'] || 
      data['notes'] || 
      '';
      
    // Extract submissions array if available (from the new format)
    if (data.submissions && Array.isArray(data.submissions)) {
      // Try to extract data from the submissions array
      data.submissions.forEach((submission: any) => {
        if (submission.label === 'First name' && !firstName) {
          firstName = submission.value;
        } else if (submission.label === 'Last name' && !lastName) {
          lastName = submission.value;
        } else if (submission.label === 'Email' && !email) {
          email = submission.value;
        } else if (submission.label === 'Phone' && !phone) {
          phone = submission.value;
        } else if ((submission.label === 'Who asked you to take this class?' || 
                   submission.label.includes('referral')) && !referralSource) {
          referralSource = submission.value;
        } else if (submission.label === 'What class are you taking?' && !notes) {
          notes = submission.value;
        }
      });
    }
    
    // Log the extracted client data
    console.log('[WEBHOOK HANDLER] Extracted client data:', { 
      firstName, lastName, email, phone, referralSource, notes 
    });
    
    // Create a new client record in the database
    // try {
    //   const newClient = await prisma.client.create({
    //     data: {
    //       firstName,
    //       lastName,
    //       email,
    //       phone,
    //       referralSource,
    //       notes,
    //       // Set default values for required fields
    //       currentBalance: 0,
    //     },
    //   });
      
    //   console.log('[WEBHOOK HANDLER] Created new client with ID:', newClient.id.toString());
    //   return new Response(JSON.stringify({ 
    //     success: true, 
    //     message: 'Form submission processed successfully',
    //     clientId: newClient.id.toString() // Convert BigInt to string
    //   }), {
    //     status: 200,
    //     headers: {
    //       'Content-Type': 'application/json'
    //     }
    //   });
    // } catch (dbError) {
    //   console.error('[WEBHOOK HANDLER] Database error:', dbError);
    //   throw new Error(`Database error: ${dbError.message}`);
    // }
    
    // This code should not be reached due to the early return in the try block above
    // But keeping it as a fallback
    console.error('[WEBHOOK HANDLER] Warning: Reached unreachable code');
    
  } catch (error) {
    console.error('[WEBHOOK HANDLER] Error processing Wix form webhook:', error);
    
    // Log the request information for debugging
    try {
      console.log('[WEBHOOK HANDLER] Request URL:', req.url);
      console.log('[WEBHOOK HANDLER] Request method:', req.method);
      // Log headers in a way that works with all Headers implementations
      const headerObj = {};
      req.headers.forEach((value, key) => {
        headerObj[key] = value;
      });
      console.log('[WEBHOOK HANDLER] Request headers:', headerObj);
    } catch (logError) {
      console.error('[WEBHOOK HANDLER] Error logging request details:', logError);
    }
    
    // Create a safe error object that can be serialized
    const safeError = {
      success: false, 
      message: 'Error processing form submission',
      error: error instanceof Error ? error.message : String(error)
    };
    
    // Return an error response
    return new Response(JSON.stringify(safeError), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
