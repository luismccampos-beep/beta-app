'use client';

import { useState } from 'react';
import { Star, ThumbsUp, Send } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Textarea } from '@/app/components/ui/textarea';
import { Input } from '@/app/components/ui/input';
import { Card, CardContent } from '@/app/components/ui/card';
import { submitDestinationReview } from '@/actions/submit-destination-review';

type Review = {
  id: string;
  authorName: string;
  rating: number;
  comment: string;
  helpfulCount: number;
  createdAt: Date;
};

export function DestinationReviews({
  destinoId,
  initialReviews,
}: {
  destinoId: number;
  initialReviews: Review[];
}) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    const form = new FormData();
    form.set('destinoId', String(destinoId));
    form.set('authorName', authorName);
    form.set('authorEmail', authorEmail);
    form.set('rating', String(rating));
    form.set('comment', comment);

    const result = await submitDestinationReview(form);

    if (result.success) {
      setMessage({ type: 'success', text: 'Review enviada com sucesso!' });
      setAuthorName('');
      setAuthorEmail('');
      setRating(5);
      setComment('');
      setReviews((prev) => [
        {
          id: crypto.randomUUID(),
          authorName,
          rating,
          comment,
          helpfulCount: 0,
          createdAt: new Date(),
        },
        ...prev,
      ]);
    } else {
      setMessage({ type: 'error', text: result.error ?? 'Erro ao enviar.' });
    }

    setSubmitting(false);
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Avaliações e Comentários</h2>

      {reviews.length > 0 && (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id} className="dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{review.authorName}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString('pt-PT')}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mt-2">{review.comment}</p>
                {review.helpfulCount > 0 && (
                  <div className="flex items-center gap-1 mt-2 text-sm text-gray-500 dark:text-gray-400">
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{review.helpfulCount}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {reviews.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          Ainda não há avaliações. Sé o primeiro a comentar!
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 border-t pt-8 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Deixa a tua avaliação</h3>

        {message && (
          <div
            className={`p-3 rounded-lg text-sm ${
              message.type === 'success'
                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nome *
            </label>
            <Input
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="O teu nome"
              required
              minLength={2}
              maxLength={120}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email (opcional)
            </label>
            <Input
              type="email"
              value={authorEmail}
              onChange={(e) => setAuthorEmail(e.target.value)}
              placeholder="teu@email.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Classificação
          </label>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => {
              const star = i + 1;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  className="p-0.5 transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-6 h-6 cursor-pointer ${
                      star <= (hoveredStar || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Comentário *
          </label>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Partilha a tua experiência neste destino..."
            required
            minLength={10}
            maxLength={2000}
            rows={4}
          />
        </div>

        <Button
          type="submit"
          disabled={submitting}
          className="gap-2 bg-gradient-to-r from-teal-600 to-orange-500 hover:from-teal-700 hover:to-orange-600"
        >
          <Send className="w-4 h-4" />
          {submitting ? 'A enviar...' : 'Enviar Avaliação'}
        </Button>
      </form>
    </div>
  );
}
