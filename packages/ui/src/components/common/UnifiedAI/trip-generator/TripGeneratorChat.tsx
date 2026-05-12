"use client";

import { Button } from '../../../Button';
import { TripFormRenderer } from './TripFormRenderer';
import { useTripGenerator } from './useTripGenerator';

export function TripGeneratorChat() {
  const { trip, error, generateTrip, clearTrip } = useTripGenerator();

  return (
    <div className="space-y-4">
      <TripFormRenderer onSubmit={generateTrip} />
      {error && <div className="text-sm text-destructive">{error}</div>}
      {trip && (
        <div className="rounded-lg border border-border p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold">{trip.destination}</div>
              <div className="text-sm text-muted-foreground">{trip.summary}</div>
            </div>
            <Button size="sm" variant="ghost" type="button" onClick={clearTrip}>
              Limpar
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            {trip.duration} dias · {trip.totalEstimatedCost.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}
          </div>
          <div className="space-y-2">
            {trip.days.map((day) => (
              <div key={day.day} className="rounded-md border border-border p-3">
                <div className="font-medium">Dia {day.day}: {day.title}</div>
                <div className="text-sm text-muted-foreground">{day.location}</div>
                <ul className="mt-2 list-disc pl-5 text-sm">
                  {day.activities.map((activity, index) => (
                    <li key={`${day.day}-${index}`}>{activity}</li>
                  ))}
                </ul>
                <div className="mt-2 text-xs text-muted-foreground">
                  Estimativa: {day.estimatedCost.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
