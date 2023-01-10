import React, { useCallback, useState } from 'react';

interface CreateTicketForm {
  createTicket: (description: string) => Promise<void> | void;
}

export function CreateTicketForm({ createTicket }: CreateTicketForm) {
  const [description, setDescription] = useState('');
  const [creatingTicket, setCreatingTicket] = useState(false);

  const submitForm = useCallback(async () => {
    setCreatingTicket(true);
    try {
      await createTicket(description);
      setDescription('');
    } catch (e: unknown) {
      // show error
    } finally {
      setCreatingTicket(false);
    }
  }, [description, createTicket]);

  return (
    <div>
      <form onSubmit={submitForm}>
        <div>
          <label htmlFor="description">Description</label>
        </div>
        <div>
          <textarea
            name="description"
            id="description"
            value={description}
            onInput={(event) => setDescription(event.currentTarget.value)}
          ></textarea>
        </div>
        {/* type is submit by default, but I like to be explicit about it */}
        <button type="submit" disabled={creatingTicket}>
          {!creatingTicket ? 'Create Ticket' : 'Creating...'}
        </button>
      </form>
    </div>
  );
}

export default CreateTicketForm;
